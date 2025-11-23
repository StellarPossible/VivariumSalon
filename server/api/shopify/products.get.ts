export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const storeDomain = config.public.shopifyStoreDomain?.replace(/^https?:\/\//, '')
  
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
            priceRange {
              minVariantPrice {
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
          variables: { first: 10 },
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
    
    const products = data.data.products.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      description: edge.node.description,
      handle: edge.node.handle,
      price: edge.node.priceRange.minVariantPrice.amount,
      currency: edge.node.priceRange.minVariantPrice.currencyCode,
      image: edge.node.images.edges[0]?.node.url || null,
      imageAlt: edge.node.images.edges[0]?.node.altText || edge.node.title,
      available: edge.node.variants.edges[0]?.node.availableForSale || false,
      variantId: edge.node.variants.edges[0]?.node.id,
    }))

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
