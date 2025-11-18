import type { WordPressUser, User, AuthResponse, JWTPayload } from '~/types/auth'

export default defineEventHandler(async (event): Promise<AuthResponse> => {
  const token = getCookie(event, 'auth-token')
  const config = useRuntimeConfig()
  
  if (!token) {
    return { success: false, message: 'Not authenticated' }
  }

  try {
    // Method 1: JWT Token Validation (recommended for production)
    if (token.includes('.') && config.jwtSecret) {
      return await validateJWTSession(token, config)
    }
    
    // Method 2: Session Token with WordPress Validation
    return await validateSessionToken(token, config, event)
    
  } catch (error: any) {
    console.error('Session validation error:', error)
    
    // Clear invalid cookies
    deleteCookie(event, 'auth-token', { path: '/' })
    deleteCookie(event, 'user-data', { path: '/' })
    
    return { success: false, message: 'Session validation failed' }
  }
})

async function validateJWTSession(token: string, config: any): Promise<AuthResponse> {
  try {
    const jwtSecret = config.jwtSecret
    if (!jwtSecret) {
      throw new Error('JWT secret not configured')
    }
    
    // Dynamic import for JWT
    const jwt = await import('jsonwebtoken')
    const decoded = jwt.default.verify(token, jwtSecret) as JWTPayload
    
    return {
      success: true,
      user: {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
        name: decoded.name,
        roles: decoded.roles,
        avatar: decoded.avatar ?? null,
        description: decoded.description ?? null
      }
    }
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return { success: false, message: 'Session expired. Please log in again.' }
    }
    if (error.name === 'JsonWebTokenError') {
      return { success: false, message: 'Invalid session. Please log in again.' }
    }
    throw error
  }
}

async function validateSessionToken(token: string, config: any, event: any): Promise<AuthResponse> {
  try {
    // Decode the session token to get username and timestamp
    const tokenData = Buffer.from(token, 'base64').toString('utf-8')
    const [username, timestamp] = tokenData.split(':')
    
    if (!username || !timestamp) {
      return { success: false, message: 'Invalid session format' }
    }
    
    // Check if session is too old (7 days)
    const sessionAge = Date.now() - parseInt(timestamp)
    const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    
    if (sessionAge > maxAge) {
      return { success: false, message: 'Session expired. Please log in again.' }
    }
    
    // Get user data from stored cookie
    const userData = getCookie(event, 'user-data')
    if (!userData) {
      return { success: false, message: 'Session data missing. Please log in again.' }
    }
    
    let user: User
    try {
      user = JSON.parse(userData)
    } catch (parseError) {
      console.error('Failed to parse user data:', parseError)
      return { success: false, message: 'Invalid session data. Please log in again.' }
    }
    
    // Verify the token matches the user
    if (username !== user.username) {
      return { success: false, message: 'Session mismatch. Please log in again.' }
    }
    
    // Check if we need to refresh user data from WordPress
    const lastValidated = user.lastValidated ? new Date(user.lastValidated) : null
    const shouldRefresh = !lastValidated || (Date.now() - lastValidated.getTime()) > (24 * 60 * 60 * 1000) // 24 hours
    
    if (shouldRefresh) {
      try {
        // Refresh user data from WordPress
        const refreshedUser = await refreshUserFromWordPress(user.id, config)
        if (refreshedUser) {
          // Update the user data cookie with fresh data
          const updatedUser = {
            ...refreshedUser,
            lastValidated: new Date().toISOString()
          }
          
          setCookie(event, 'user-data', JSON.stringify(updatedUser), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
          })
          
          return {
            success: true,
            user: updatedUser
          }
        }
      } catch (refreshError) {
        console.warn('Failed to refresh user data, using cached data:', refreshError)
      }
    }
    
    // Return cached user data
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        roles: user.roles,
        avatar: user.avatar ?? null,
        description: user.description ?? null,
        url: user.url ?? null,
        lastValidated: user.lastValidated ?? null
      }
    }
    
  } catch (error: any) {
    console.error('Session validation error:', error)
    return { success: false, message: 'Session validation failed. Please log in again.' }
  }
}

async function refreshUserFromWordPress(userId: number, config: any): Promise<User | null> {
  try {
    if (!config.public.wpUser || !config.wpAppPassword) {
      throw new Error('WordPress credentials not configured')
    }
    
    const wpEndpoint = config.public.wpRestEndpoint || 'https://stellarpossible.com/wp-json'
    
    const wpUser = await $fetch<WordPressUser>(`${wpEndpoint}/wp/v2/users/${userId}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${config.public.wpUser}:${config.wpAppPassword}`).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (wpUser && wpUser.id === userId) {
      return {
        id: wpUser.id,
        username: wpUser.username,
        email: wpUser.email,
        name: wpUser.name || wpUser.username,
        roles: wpUser.roles,
        avatar: wpUser.avatar_urls?.['96'] ?? null,
        description: wpUser.description ?? null,
        url: wpUser.url ?? null
      }
    }
    
    return null
  } catch (error) {
    console.error('Failed to refresh user from WordPress:', error)
    return null
  }
}