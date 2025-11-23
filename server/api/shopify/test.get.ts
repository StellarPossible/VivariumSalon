export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  const checks = {
    hasStoreDomain: !!config.public.shopifyStoreDomain,
    hasAccessToken: !!config.public.shopifyStorefrontToken,
    storeDomain: config.public.shopifyStoreDomain || 'NOT SET',
    apiVersion: config.public.shopifyApiVersion || 'NOT SET',
    tokenPreview: config.public.shopifyStorefrontToken 
      ? config.public.shopifyStorefrontToken.substring(0, 10) + '...' 
      : 'NOT SET',
    tokenType: config.public.shopifyStorefrontToken?.startsWith('shpat_') 
      ? 'Storefront API (Correct)' 
      : config.public.shopifyStorefrontToken?.startsWith('shpss_')
      ? 'Admin API (WRONG - use Storefront token)'
      : 'Unknown token type'
  }

  if (!checks.hasStoreDomain || !checks.hasAccessToken) {
    return {
      success: false,
      message: 'Shopify credentials not configured',
      checks,
      error: 'Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN'
    }
  }

  // Simpler test query that requires minimal permissions
  const testQuery = `
    query {
      products(first: 1) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `

  const url = `https://${config.public.shopifyStoreDomain}/api/${config.public.shopifyApiVersion}/graphql.json`
  
  try {
    console.log('Testing Shopify connection...')
    console.log('URL:', url)
    console.log('Token type:', checks.tokenType)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': config.public.shopifyStorefrontToken,
      },
      body: JSON.stringify({ query: testQuery })
    })

    const responseText = await response.text()
    let data
    
    try {
      data = JSON.parse(responseText)
    } catch {
      return {
        success: false,
        message: 'Invalid JSON response',
        checks,
        statusCode: response.status,
        statusText: response.statusText,
        rawResponse: responseText.substring(0, 500)
      }
    }

    if (!response.ok) {
      return {
        success: false,
        message: 'API request failed',
        checks,
        statusCode: response.status,
        statusText: response.statusText,
        error: data,
        hint: checks.tokenType.includes('WRONG') 
          ? 'You are using an Admin API token. Please use a Storefront API token (starts with shpat_)'
          : 'Check that your app has Storefront API scopes enabled'
      }
    }

    if (data.errors) {
      return {
        success: false,
        message: 'GraphQL errors returned',
        checks,
        errors: data.errors,
        hint: data.errors[0]?.extensions?.code === 'UNAUTHORIZED'
          ? 'Token is invalid or missing required scopes. Make sure you enabled unauthenticated_read_product_listings in Storefront API scopes'
          : 'Unknown GraphQL error'
      }
    }

    const productCount = data.data?.products?.edges?.length || 0

    return {
      success: true,
      message: 'Successfully connected to Shopify!',
      checks,
      productCount,
      sampleProduct: data.data?.products?.edges[0]?.node || null,
      fullResponse: data
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'Connection error',
      checks,
      error: error.message,
      stack: error.stack
    }
  }
})