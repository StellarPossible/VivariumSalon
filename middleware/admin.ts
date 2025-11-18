export default defineNuxtRouteMiddleware((to) => {
  const user = useState<any>('auth.user')

  if (!user.value) {
    return navigateTo('/login')
  }

  if (!user.value.roles?.includes('administrator')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied. Admin privileges required.'
    })
  }
})
