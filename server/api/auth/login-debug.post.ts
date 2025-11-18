import type { WordPressUser, User, AuthResponse } from '~/types/auth'

export default defineEventHandler(async (event): Promise<any> => {
  const { username, password } = await readBody(event)
  const config = useRuntimeConfig()
  
  console.log('Login attempt:', { username, passwordLength: password?.length })
  console.log('Config:', { 
    wpUser: config.public.wpUser, 
    hasAppPassword: !!config.wpAppPassword,
    wpEndpoint: config.public.wpRestEndpoint 
  })
  
  // Input validation
  if (!username || !password) {
    return {
      success: false,
      message: 'Username and password are required',
      debug: { username: !!username, password: !!password }
    }
  }
  
  try {
    const wpEndpoint = config.public.wpRestEndpoint || 'https://stellarpossible.com/cms/wp-json'
    const authString = Buffer.from(`${config.public.wpUser}:${config.wpAppPassword}`).toString('base64')
    
    console.log('Making request to:', `${wpEndpoint}/wp/v2/users/me`)
    
    // Test the Application Password authentication first
    const response = await $fetch<WordPressUser>(`${wpEndpoint}/wp/v2/users/me`, {
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('WordPress API response:', response)
    
    // For now, let's just check if the username matches and skip password validation
    const usernameMatches = username === config.public.wpUser || 
                           username === `${config.public.wpUser}@stellarpossible.com`
    
    if (!usernameMatches) {
      return {
        success: false,
        message: 'Username does not match',
        debug: { 
          provided: username, 
          expected: config.public.wpUser,
          emailFormat: `${config.public.wpUser}@stellarpossible.com`
        }
      }
    }
    
    // For debugging, let's return success if we get here
    return {
      success: true,
      message: 'Authentication successful (debug mode)',
      debug: {
        username,
        wpResponse: !!response,
        userId: response?.id
      }
    }
    
  } catch (error: any) {
    console.error('Login error:', error)
    
    return {
      success: false,
      message: 'API call failed',
      debug: {
        error: error.message,
        status: error.status,
        code: error.code
      }
    }
  }
})
