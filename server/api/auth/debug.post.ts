export default defineEventHandler(async (event) => {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found'
    })
  }
  
  const config = useRuntimeConfig()
  
  const debugInfo: {
    environment: string | undefined
    wpRestEndpoint: string
    wpUser: string
    hasWpAppPassword: boolean
    useJWT: string
    wordpressConnection: null | {
      status: string
      name?: any
      description?: any
      url?: any
      routes?: string[]
      error?: any
      statusCode?: any
    }
    authentication: null | {
      status: string
      user?: any
      roles?: any
      error?: any
      statusCode?: any
      message?: string
    }
  } = {
    environment: process.env.NODE_ENV,
    wpRestEndpoint: config.public.wpRestEndpoint,
    wpUser: config.public.wpUser,
    hasWpAppPassword: !!config.wpAppPassword,
    useJWT: config.public.useJWT,
    wordpressConnection: null,
    authentication: null
  }
  
  // Test WordPress connection
  try {
    const wpEndpoint = config.public.wpRestEndpoint || 'https://stellarpossible.com/wp-json'
    
    // Test basic WordPress API connectivity
  const wpInfo: any = await $fetch(`${wpEndpoint}/wp/v2/`)
    
    debugInfo.wordpressConnection = {
      status: 'connected',
      name: wpInfo.name,
      description: wpInfo.description,
      url: wpInfo.url,
      routes: Object.keys(wpInfo.routes || {}).slice(0, 5) // Show first 5 routes
    }
    
    // Test authentication
    if (config.public.wpUser && config.wpAppPassword) {
      try {
        const authTest: any = await $fetch(`${wpEndpoint}/wp/v2/users/me`, {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${config.public.wpUser}:${config.wpAppPassword}`).toString('base64')}`
          }
        })
        
        debugInfo.authentication = {
          status: 'authenticated',
          user: authTest.username,
          roles: authTest.roles
        }
      } catch (authError: any) {
        debugInfo.authentication = {
          status: 'failed',
          error: authError.message,
          statusCode: authError.status || authError.statusCode
        }
      }
    } else {
      debugInfo.authentication = {
        status: 'not_configured',
        message: 'WordPress credentials not provided'
      }
    }
    
  } catch (error: any) {
    debugInfo.wordpressConnection = {
      status: 'failed',
      error: error.message,
      statusCode: error.status || error.statusCode
    }
  }
  
  return debugInfo
})