export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      return navigateTo('/auth/signin')
    }

    try {
      const config = useRuntimeConfig()
      const apiBase = config.public.backendApiBase as string
      
      const response = await $fetch(`${apiBase}/api/v1/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = response as any
      if (data.user?.role !== 'admin') {
        return navigateTo('/')
      }
    } catch {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      return navigateTo('/auth/signin')
    }
  }
})
