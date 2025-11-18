import type { AuthResponse } from '~/types/auth'

export default defineEventHandler(async (event): Promise<AuthResponse> => {
  try {
    // Clear the auth cookie
    deleteCookie(event, 'auth-token', {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    
    // Clear user data cookie (if using session-based auth)
    deleteCookie(event, 'user-data', {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    
    return {
      success: true,
      message: 'Logged out successfully'
    }
  } catch (error) {
    console.error('Logout error:', error)
    return {
      success: false,
      message: 'Logout failed'
    }
  }
})