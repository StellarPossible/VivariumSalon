import type { WordPressUser } from '~/types/auth'

export default defineEventHandler(async (event) => {
  console.log('=== LOGIN ENDPOINT CALLED ===')
  
  const { username, password } = await readBody(event)
  const config = useRuntimeConfig()
  
  console.log('Username:', username)
  console.log('Password length:', password?.length || 0)
  
  // Simple validation
  if (!username || !password) {
    console.log('Missing credentials')
    return { success: false, message: 'Username and password are required' }
  }
  
  // Check username length (unless it's an email)
  const isEmail = username.includes('@') && username.includes('.')
  if (!isEmail && username.length < 6) {
    console.log('Username too short')
    return { success: false, message: 'Username must be at least 6 characters long' }
  }
  
  // For the demo site, we'll use hardcoded credentials for testing
  // In production, this should be replaced with actual WordPress authentication
  const validUsers = [
    { username: 'mlvalentonis', password: '@Mmdel2022' },
    { username: 'mlvalentonis@stellarpossible.com', password: '@Mmdel2022' }
  ]
  
  // Find matching user
  const matchedUser = validUsers.find(
    user => user.username === username && user.password === password
  )
  
  if (!matchedUser) {
    console.log('Invalid credentials')
    return { success: false, message: 'Invalid username or password' }
  }
  
  console.log('Credentials valid, creating user session...')
  
  try {
    // Since we can't reliably authenticate against WordPress API due to Cloudflare protection,
    // We'll use mock data for development and demonstration purposes
    
    // Mock user response based on the debug log data
    const response: WordPressUser = {
      id: 1,
      username: username === 'mlvalentonis@stellarpossible.com' ? 'mlvalentonis@stellarpossible.com' : 'mlvalentonis',
      email: 'mlvalentonis@stellarpossible.com',
      name: 'Marie Valentonis',
      roles: ['administrator'],
      avatar_urls: {
        '24': 'https://secure.gravatar.com/avatar/default?s=24&d=mm&r=g',
        '48': 'https://secure.gravatar.com/avatar/default?s=48&d=mm&r=g',
        '96': 'https://secure.gravatar.com/avatar/default?s=96&d=mm&r=g'
      },
      description: 'Site Administrator'
    }
    
    console.log('User data created for:', response.username)
    
    // Create a simple session token
    const sessionToken = Buffer.from(`${response.username}:${Date.now()}`).toString('base64')
    
    // Set auth token cookie
    setCookie(event, 'auth-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // secure in production
      sameSite: 'lax', // Changed to lax to work better with redirects
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })
    
    // Store user data in a separate cookie for session validation
    const userData = {
      id: response.id,
      username: response.username,
      email: response.email,
      name: response.name,
      roles: response.roles
    }
    
    setCookie(event, 'user-data', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed to lax to work better with redirects
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })
    
    console.log('Login successful!')
    
    return {
      success: true,
      user: {
        id: response.id,
        username: response.username,
        email: response.email,
        name: response.name,
        roles: response.roles
      },
      token: sessionToken
    }
  } catch (error: any) {
    console.error('Login error:', error)
    
    // Provide more specific error messages
    if (error.status === 401 || error.status === 403) {
      return { success: false, message: 'Invalid username or password' }
    }
    
    return { success: false, message: 'Authentication service error' }
  }
})
