interface TestResult {
  test: string
  status: 'success' | 'failed'
  data?: any
  error?: {
    message: string
    status?: number
    statusCode?: number
    cause?: any
    authUser?: string
    passwordFormat?: string
    testedWith?: string
  }
}

interface TestResults {
  endpoint: string
  tests: TestResult[]
}

export default defineEventHandler(async (event): Promise<TestResults> => {
  const config = useRuntimeConfig()
  const wpEndpoint = config.public.wpRestEndpoint || 'https://stellarpossible.com/wp-json'
  
  const testResults: TestResults = {
    endpoint: wpEndpoint,
    tests: []
  }
  
  // Test 1: Basic WordPress API connectivity
  try {
    const response: any = await $fetch(`${wpEndpoint}/`, {
      timeout: 10000
    })
    
    testResults.tests.push({
      test: 'WordPress API Basic Connectivity',
      status: 'success',
      data: {
        name: response.name || 'WordPress Site',
        description: response.description || 'No description',
        routes: response.routes ? Object.keys(response.routes).length : 0
      }
    })
  } catch (error: any) {
    testResults.tests.push({
      test: 'WordPress API Basic Connectivity',
      status: 'failed',
      error: {
        message: error.message,
        status: error.status || error.statusCode,
        cause: error.cause?.code || error.code
      }
    })
  }
  
  // Test 2: Check credentials configuration
  testResults.tests.push({
    test: 'Credentials Configuration Check',
    status: config.public.wpUser && config.wpAppPassword ? 'success' : 'failed',
    data: {
      hasWpUser: !!config.public.wpUser,
      wpUser: config.public.wpUser || 'Not set',
      hasWpAppPassword: !!config.wpAppPassword,
      wpAppPasswordLength: config.wpAppPassword ? config.wpAppPassword.length : 0
    }
  })
  
  // Test 3: Authentication test with detailed error info
  if (config.public.wpUser && config.wpAppPassword) {
    try {
      const authString = Buffer.from(`${config.public.wpUser}:${config.wpAppPassword}`).toString('base64')
      
      console.log('Testing authentication with:', {
        user: config.public.wpUser,
        passwordLength: config.wpAppPassword.length,
        authStringLength: authString.length
      })
      
      const response: any = await $fetch(`${wpEndpoint}/wp/v2/users/me`, {
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json',
          'User-Agent': 'StellarPossible-Nuxt-App/1.0'
        },
        timeout: 10000
      })
      
      testResults.tests.push({
        test: 'WordPress Authentication',
        status: 'success',
        data: {
          user: response.username,
          email: response.email,
          roles: response.roles,
          id: response.id
        }
      })
    } catch (error: any) {
      testResults.tests.push({
        test: 'WordPress Authentication',
        status: 'failed',
        error: {
          message: error.message,
          status: error.status || error.statusCode,
          cause: error.cause?.code || error.code,
          authUser: config.public.wpUser,
          passwordFormat: config.wpAppPassword ? 'Set (length: ' + config.wpAppPassword.length + ')' : 'Not set'
        }
      })
    }
  }
  
  // Test 4: Test GraphQL endpoint
  try {
    const graphqlEndpoint = config.public.wpGraphqlEndpoint || 'https://stellarpossible.com/cms/graphql';
    const authString = config.public.wpUser && config.wpAppPassword ? 
      Buffer.from(`${config.public.wpUser}:${config.wpAppPassword}`).toString('base64') : '';
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (authString) {
      headers['Authorization'] = `Basic ${authString}`;
    }
    
    const response: any = await $fetch(graphqlEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: `
          query TestQuery {
            posts(first: 1) {
              nodes {
                id
                title
              }
            }
          }
        `
      }),
      timeout: 10000
    });
    
    testResults.tests.push({
      test: 'GraphQL API Connectivity',
      status: 'success',
      data: {
        endpoint: graphqlEndpoint,
        postCount: response.data?.posts?.nodes?.length || 0,
        firstPost: response.data?.posts?.nodes?.[0]?.title || 'No posts found'
      }
    });
  } catch (error: any) {
    testResults.tests.push({
      test: 'GraphQL API Connectivity',
      status: 'failed',
      error: {
        message: error.message,
        status: error.status || error.statusCode,
        cause: error.cause?.code || error.code
      }
    });
  }

  // Test 5: Try alternative authentication formats
  if (config.public.wpUser && config.wpAppPassword) {
    // Test with email if username fails
    const possibleUsernames = [
      config.public.wpUser,
      config.public.wpUser.toLowerCase(),
      `${config.public.wpUser}@stellarpossible.com`
    ]
    
    for (const testUser of possibleUsernames) {
      if (testUser === config.public.wpUser) continue // Skip the one we already tested
      
      try {
        const authString = Buffer.from(`${testUser}:${config.wpAppPassword}`).toString('base64')
        
        const response: any = await $fetch(`${wpEndpoint}/wp/v2/users/me`, {
          headers: {
            'Authorization': `Basic ${authString}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        })
        
        testResults.tests.push({
          test: `Alternative Auth (${testUser})`,
          status: 'success',
          data: {
            user: response.username,
            testedWith: testUser,
            actualUsername: response.username
          }
        })
        break // Stop testing if one works
        
      } catch (error: any) {
        testResults.tests.push({
          test: `Alternative Auth (${testUser})`,
          status: 'failed',
          error: {
            message: error.message,
            status: error.status || error.statusCode,
            testedWith: testUser
          }
        })
      }
    }
  }
  
  return testResults
})