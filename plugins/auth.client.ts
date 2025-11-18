import type { User } from '~/types/auth'

export default defineNuxtPlugin(async () => {
  const user = useState<User | null>('auth.user', () => null)
  
  // Check if user is logged in on app start
  try {
    const response = await $fetch<{ success: boolean; user?: User }>('/api/auth/me')
    if (response.success && response.user) {
      user.value = response.user
    } else {
      user.value = null
    }
  } catch (error) {
    // User not logged in, that's okay
    user.value = null
    console.log('User not authenticated on app start')
  }
})