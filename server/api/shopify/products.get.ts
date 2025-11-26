export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const storeDomain = config.public.shopifyStoreDomain?.replace(/^https?:\/\//, '')

  const parseMetafieldDescriptor = (descriptor?: string | null) => {
    if (!descriptor) {
      return null
    }
    const parts = descriptor.split('.')
    if (parts.length < 2) {
      return null
    }
    const namespace = parts.shift()?.trim() || ''
    const key = parts.join('.').trim()
    if (!namespace || !key) {
      return null
    }
    const isValid = /^[A-Za-z0-9_.-]+$/.test(namespace) && /^[A-Za-z0-9_.-]+$/.test(key)
    return isValid ? { namespace, key } : null
  }

  const categoryMetafield = parseMetafieldDescriptor(
    config.public.shopifyProductCategoryMetafield,
  )

  const categoryMetafieldSelection = categoryMetafield
    ? `
            categoryMetafield: metafield(namespace: ${JSON.stringify(categoryMetafield.namespace)}, key: ${JSON.stringify(categoryMetafield.key)}) {
              value
              type
            }
          `
    : ''

  const extractMetafieldValues = (metafield: { value?: string | null; type?: string | null } | null) => {
    if (!metafield?.value) {
      return []
    }

    const rawValue = metafield.value.trim()
    if (!rawValue) {
      return []
    }

    const type = metafield.type || ''

    const parseJson = () => {
      try {
        const parsed = JSON.parse(rawValue)
        if (Array.isArray(parsed)) {
          return parsed
            .map((item) => (typeof item === 'string' ? item : String(item)))
            .filter((item) => item.trim().length)
        }
        if (parsed && typeof parsed === 'object') {
          return Object.values(parsed)
            .map((item) => (typeof item === 'string' ? item : String(item)))
            .filter((item) => item.trim().length)
        }
        if (parsed !== null && parsed !== undefined) {
          return [String(parsed)]
        }
      } catch (error) {
        return []
      }
      return []
    }

    if (type.startsWith('list.') || type === 'json') {
      const parsed = parseJson()
      if (parsed.length) {
        return parsed
      }
    }

    if (type === 'number_integer' || type === 'number_decimal') {
      return [rawValue]
    }

    const segments = rawValue
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length)

    return segments.length ? segments : [rawValue]
  }
  
  if (!storeDomain || !config.public.shopifyStorefrontToken) {
    console.error('Shopify credentials not configured')
    throw createError({
      statusCode: 500,
      statusMessage: 'Shopify API not configured. Please check environment variables.',
    })
  }

  const shopifyQuery = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            productType
            tags
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            ${categoryMetafieldSelection}
            variants(first: 1) {
              edges {
                node {
                  id
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `

  try {
    console.log('Fetching products from Shopify...')
    console.log('Store:', storeDomain)
    
    const response = await fetch(
      `https://${storeDomain}/api/${config.public.shopifyApiVersion}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': config.public.shopifyStorefrontToken,
        },
        body: JSON.stringify({
          query: shopifyQuery,
          variables: { first: 250 },
        }),
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Shopify API Error:', response.status, errorText)
      throw createError({
        statusCode: response.status,
        statusMessage: `Shopify API Error: ${response.statusText}`,
      })
    }

    const data = await response.json()
    
    if (data.errors) {
      console.error('GraphQL Errors:', data.errors)
      const unauthorized = data.errors.some((error: any) => error?.extensions?.code === 'UNAUTHORIZED')

      throw createError({
        statusCode: unauthorized ? 401 : 400,
        statusMessage: unauthorized
          ? 'Shopify Storefront token unauthorized. Regenerate the token or verify permissions.'
          : 'GraphQL query failed',
        data: data.errors,
      })
    }

    console.log(`Successfully fetched ${data.data.products.edges.length} products`)
    
    const products = data.data.products.edges.map((edge: any) => {
      const categoryMetafieldValues = extractMetafieldValues(
        edge.node.categoryMetafield ?? null,
      )

      return {
        id: edge.node.id,
        title: edge.node.title,
        description: edge.node.description,
        handle: edge.node.handle,
        productType: edge.node.productType,
        tags: edge.node.tags || [],
        price: edge.node.priceRange.minVariantPrice.amount,
        currency: edge.node.priceRange.minVariantPrice.currencyCode,
        image: edge.node.images.edges[0]?.node.url || null,
        imageAlt: edge.node.images.edges[0]?.node.altText || edge.node.title,
        available: edge.node.variants.edges[0]?.node.availableForSale || false,
        variantId: edge.node.variants.edges[0]?.node.id,
        categoryMetafield: edge.node.categoryMetafield
          ? {
              value: edge.node.categoryMetafield.value,
              type: edge.node.categoryMetafield.type,
            }
          : null,
        categories: categoryMetafieldValues,
      }
    })

    return {
      success: true,
      products,
      count: products.length,
    }
  } catch (error: any) {
    console.error('Shopify API Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch products from Shopify',
    })
  }
})
