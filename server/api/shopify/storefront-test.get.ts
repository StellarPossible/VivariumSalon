export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  const query = `{
    products(first: 5) {
      edges {
        node {
          id
          title
          handle
          description
        }
      }
    }
  }`

  try {
    const response = await fetch(
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

    const data = await response.json()
    return data
  } catch (error) {
    return {
      error: true,
      message: error.message,
    }
  }
})
