import type { WordPressUser, AuthResponse } from '~/types/auth'

export default defineEventHandler(async (event): Promise<AuthResponse> => {
  const { username, email, password } = await readBody(event)
  const config = useRuntimeConfig()
  
  console.log('Registration attempt:', { username, email, hasPassword: !!password })
  
  // Input validation
  if (!username || !email || !password) {
    return {
      success: false,
      message: 'Username, email, and password are required'
    }
  }
  
  if (password.length < 8) {
    return {
      success: false,
      message: 'Password must be at least 8 characters long'
    }
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: 'Please enter a valid email address'
    }
  }
  
  // Username validation
  if (username.length < 6) {
    return {
      success: false,
      message: 'Username must be at least 6 characters long'
    }
  }
  
  if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
    return {
      success: false,
      message: 'Username can only contain letters, numbers, dots, dashes, and underscores'
    }
  }
  
  try {
    const wpEndpoint = config.public.wpRestEndpoint || 'https://stellarpossible.com/wp-json'
    
    console.log('Attempting WordPress registration at:', wpEndpoint)
    console.log('Using WP User:', config.public.wpUser)
    console.log('Has WP App Password:', !!config.wpAppPassword)
    
    // Check if WordPress credentials are configured
    if (!config.public.wpUser || !config.wpAppPassword) {
      console.error('WordPress credentials not configured')
      return {
        success: false,
        message: 'Server configuration error. Please contact administrator.'
      }
    }
    
    const response = await $fetch<WordPressUser>(`${wpEndpoint}/wp/v2/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${config.public.wpUser}:${config.wpAppPassword}`).toString('base64')}`
      },
      body: {
        username,
        email,
        password,
        roles: ['subscriber'] // Default role for new users
      }
    })
    
    console.log('WordPress registration successful:', { id: response.id, username: response.username })
    
    return {
      success: true,
      message: 'Registration successful! You can now log in.',
      user: {
        id: response.id,
        username: response.username,
        email: response.email,
        name: response.name || response.username,
        roles: response.roles,
        avatar: response.avatar_urls?.['96'] ?? null,
        description: response.description ?? null,
        url: response.url ?? null
      }
    }
  } catch (error: any) {
    console.error('Registration error details:', {
      status: error.status,
      statusCode: error.statusCode,
      statusText: error.statusText,
      data: error.data,
      message: error.message,
      cause: error.cause
    })
    
    // Handle specific WordPress errors
    if (error.data?.code === 'existing_user_login') {
      return {
        success: false,
        message: 'Username already exists. Please choose a different username.'
      }
    }
    
    if (error.data?.code === 'existing_user_email') {
      return {
        success: false,
        message: 'Email address already registered. Please use a different email or try logging in.'
      }
    }
    
    if (error.data?.code === 'rest_cannot_create_user') {
      return {
        success: false,
        message: 'User registration is currently disabled. Please contact administrator.'
      }
    }
    
    if (error.data?.code === 'rest_user_invalid_email') {
      return {
        success: false,
        message: 'Invalid email address format. Please check and try again.'
      }
    }
    
    if (error.data?.code === 'rest_invalid_param') {
      const paramMessage = error.data?.message || 'Invalid registration data'
      return {
        success: false,
        message: `Registration error: ${paramMessage}`
      }
    }
    
    if (error.status === 401 || error.statusCode === 401) {
      return {
        success: false,
        message: 'Server authentication failed. Please contact administrator.'
      }
    }
    
    if (error.status === 403 || error.statusCode === 403) {
      return {
        success: false,
        message: 'Registration is currently disabled. Please contact administrator.'
      }
    }
    
    if (error.status === 404 || error.statusCode === 404) {
      return {
        success: false,
        message: 'Registration service not found. Please contact administrator.'
      }
    }
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return {
        success: false,
        message: 'Unable to connect to registration server. Please try again later.'
      }
    }
    
    if (error.code === 'ETIMEDOUT') {
      return {
        success: false,
        message: 'Registration request timed out. Please try again.'
      }
    }
    
    // Log the full error for debugging
    console.error('Unhandled registration error:', error)
    
    return {
      success: false,
      message: error.data?.message || `Registration failed: ${error.message || 'Unknown error'}`
    }
  }
})