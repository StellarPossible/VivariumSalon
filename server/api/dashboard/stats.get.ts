import type { User } from '~/types/auth'

export default defineEventHandler(async (event) => {
  // Read user from cookie (set by auth flow)
  const userCookie = getCookie(event, 'user-data')
  if (!userCookie) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  let user: User | null = null
  try {
    user = JSON.parse(userCookie)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid user session' })
  }

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // TODO: Fetch real stats from WordPress or database
  return {
    totalPosts: 0,
    totalComments: 0,
    lastLogin: user.lastValidated ?? null
  }
})
