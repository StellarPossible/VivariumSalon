export default defineNuxtRouteMiddleware((to) => {
  const user = useState('auth.user')

  // Allow access to auth pages without redirect
  if (to.path === '/login' || to.path === '/register') {
    return
  }

  if (!user.value) {
    return navigateTo('/login')
  }
})