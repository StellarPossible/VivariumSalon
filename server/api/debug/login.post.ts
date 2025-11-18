import type { WordPressUser, User, AuthResponse } from '~/types/auth'

export default defineEventHandler(async (event): Promise<any> => {
  const config = useRuntimeConfig()
  
  // Check if WordPress debug is enabled
  const wpDebugEnabled = await checkWordPressDebug(config)
  
  if (!wpDebugEnabled) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Debug endpoint not available'
    })
  }
  
  const { username, password } = await readBody(event)
  
  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    wpDebugEnabled: true,
    request: {
      hasUsername: !!username,
      hasPassword: !!password,
      usernameLength: username?.length || 0,
      passwordLength: password?.length || 0
    },
    config: {
      wpRestEndpoint: config.public.wpRestEndpoint,
      wpUser: config.public.wpUser,
      hasWpAppPassword: !!config.wpAppPassword,
      useJWT: config.public.useJWT
    },
    tests: {
      jwtEndpoint: null as any,
      jwtAuth: null as any,
      restApiAuth: null as any,
      userFetch: null as any,
      globalError: null as any
    }
  }
  
  try {
    const wpEndpoint = config.public.wpRestEndpoint || 'https://stellarpossible.com/wp-json'
    
    // Test 1: Check if JWT endpoint exists
    try {
      const jwtCheck = await $fetch(`${wpEndpoint}/jwt-auth/v1/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'test', password: 'test' })
      })
      debugInfo.tests.jwtEndpoint = { status: 'accessible', response: 'endpoint_exists' }
    } catch (error: any) {
      debugInfo.tests.jwtEndpoint = { 
        status: 'error', 
        statusCode: error.status || error.statusCode,
        message: error.message,
        data: error.data
      }
    }
    
    // Test 2: Try JWT authentication with provided credentials
    if (username && password) {
      try {
        const jwtResponse: any = await $fetch(`${wpEndpoint}/jwt-auth/v1/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        })
        debugInfo.tests.jwtAuth = { status: 'success', hasToken: !!jwtResponse.token }
        
        // Test 3: Try to fetch user data with JWT token
        if (jwtResponse.token) {
          try {
            const userResponse = await $fetch<WordPressUser>(`${wpEndpoint}/wp/v2/users/me`, {
              headers: {
                'Authorization': `Bearer ${jwtResponse.token}`,
                'Content-Type': 'application/json'
              }
            })
            debugInfo.tests.userFetch = { 
              status: 'success', 
              userId: userResponse.id,
              username: userResponse.username 
            }
          } catch (userError: any) {
            debugInfo.tests.userFetch = { 
              status: 'error', 
              statusCode: userError.status,
              message: userError.message 
            }
          }
        }
      } catch (jwtError: any) {
        debugInfo.tests.jwtAuth = { 
          status: 'error', 
          statusCode: jwtError.status || jwtError.statusCode,
          message: jwtError.message,
          data: jwtError.data
        }
      }
    }
    
    // Test 4: Try REST API authentication (fallback)
    try {
      const restResponse = await $fetch<WordPressUser>(`${wpEndpoint}/wp/v2/users/me`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${config.public.wpUser}:${config.wpAppPassword}`).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      })
      debugInfo.tests.restApiAuth = { 
        status: 'success', 
        userId: restResponse.id,
        username: restResponse.username 
      }
    } catch (restError: any) {
      debugInfo.tests.restApiAuth = { 
        status: 'error', 
        statusCode: restError.status,
        message: restError.message 
      }
    }
    
  } catch (globalError: any) {
    debugInfo.tests.globalError = {
      message: globalError.message,
      stack: globalError.stack
    }
  }
  
  return debugInfo
})

// Helper function to check WordPress debug status
async function checkWordPressDebug(config: any): Promise<boolean> {
  try {
    const wpEndpoint = config.public.wpRestEndpoint || 'https://stellarpossible.com/wp-json'
    
    // Try to get WordPress site health info (includes debug info)
    const response = await $fetch(`${wpEndpoint}/wp-site-health/v1/tests/background-updates`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${config.public.wpUser}:${config.wpAppPassword}`).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    })
    
    // If we can access site health, assume debug is enabled
    return true
  } catch (error) {
    // Fallback: check if we can access a debug-only endpoint
    try {
      const wpEndpoint = config.public.wpRestEndpoint || 'https://stellarpossible.com/wp-json'
      const debugResponse: any = await $fetch(`${wpEndpoint}/wp/v2/settings`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${config.public.wpUser}:${config.wpAppPassword}`).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      })
      
      // Check if debug info is present in the response
      return debugResponse && (debugResponse.debug || debugResponse.wp_debug)
    } catch {
      return false
    }
  }
}