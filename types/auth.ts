export interface WordPressUser {
  id: number
  username: string
  email: string
  name: string
  roles: string[]
  avatar_urls?: {
    [key: string]: string
  } | null
  description?: string | null
  url?: string | null
}

export interface User {
  id: number
  username: string
  email: string
  name: string
  roles: string[]
  avatar: string | null
  description: string | null
  url?: string | null
  lastValidated?: string | null
}

export interface AuthResponse {
  success: boolean
  message?: string
  user?: User
  tokenType?: 'jwt' | 'session'
}

export interface JWTPayload {
  id: number
  username: string
  email: string
  name: string
  roles: string[]
  avatar?: string | null
  description?: string | null
  iat: number
  exp: number
  iss?: string
  sub?: string
}