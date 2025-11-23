export const useShopify = () => {
  const config = useRuntimeConfig()

  const fetchProducts = async (first: number = 10) => {
    const query = `{
      products(first: ${first}) {
        edges {
          node {
            id
            title
            handle
            description
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

  const fetchProduct = async (handle: string) => {
    const query = `{
      productByHandle(handle: "${handle}") {
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
