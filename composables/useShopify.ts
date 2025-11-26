export const useShopify = () => {
  const config = useRuntimeConfig()

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

  type FetchProductsOptions = {
    first?: number
    after?: string | null
  }

  const fetchProducts = async ({ first = 10, after = null }: FetchProductsOptions = {}) => {
    const query = `#graphql
      query FetchProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          edges {
            cursor
            node {
              id
              title
              handle
              description
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
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `

    const response = await $fetch(
      `https://${config.public.shopifyStoreDomain}/api/${config.public.shopifyApiVersion}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': config.public.shopifyStorefrontToken,
        },
        body: JSON.stringify({
          query,
          variables: {
            first,
            after,
          },
        }),
      }
    )

    return response
  }

  const fetchProduct = async (handle: string) => {
    const query = `{
      productByHandle(handle: "${handle}") {
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
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }`

    const response = await $fetch(
      `https://${config.public.shopifyStoreDomain}/api/${config.public.shopifyApiVersion}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': config.public.shopifyStorefrontToken,
        },
        body: JSON.stringify({ query }),
      }
    )

    return response
  }

  return {
    fetchProducts,
    fetchProduct,
  }
}
