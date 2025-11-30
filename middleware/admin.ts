export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    
    if (!token) {
      return navigateTo('/auth/signin')
    }

    try {
      const user = JSON.parse(userData || '{}')
      if (user.role !== 'admin' && user.role !== 'super_admin') {
        return navigateTo('/')
      }
    } catch {
      return navigateTo('/auth/signin')
    }
  }
})
