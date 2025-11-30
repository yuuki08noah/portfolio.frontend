import { ref } from 'vue'

type User = {
  id?: string
  name?: string
  email?: string
  role?: 'user' | 'admin' | 'super_admin'
}

export const AUTH_TOKEN_KEY = 'auth_token'
export const USER_KEY = 'user_data'

export function useAuth() {
  const config = useRuntimeConfig()
  const apiBase = config.public.backendApiBase as string
  
  const isAuthenticated = ref(false)
  const user = ref<User | undefined>(undefined)

  // Initialize from localStorage
  if (process.client) {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    const userData = localStorage.getItem(USER_KEY)
    if (token && userData) {
      isAuthenticated.value = true
      try {
        user.value = JSON.parse(userData)
      } catch {
        user.value = undefined
      }
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch(`${apiBase}/api/v1/auth/login`, {
        method: 'POST',
        body: { email, password }
      })

      const { user: userData, token } = response as any

      isAuthenticated.value = true
      user.value = userData

      if (process.client) {
        localStorage.setItem(AUTH_TOKEN_KEY, token)
        localStorage.setItem(USER_KEY, JSON.stringify(userData))
      }

      return { success: true, user: userData }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || error.data?.error || 'Login failed'
      }
    }
  }

  const logout = () => {
    isAuthenticated.value = false
    user.value = undefined
    if (process.client) {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    try {
      const response = await $fetch(`${apiBase}/api/v1/auth/register`, {
        method: 'POST',
        body: { email, password, password_confirmation: password, name }
      })

      const { user: userData, token } = response as any

      isAuthenticated.value = true
      user.value = userData

      if (process.client) {
        localStorage.setItem(AUTH_TOKEN_KEY, token)
        localStorage.setItem(USER_KEY, JSON.stringify(userData))
      }

      return { success: true, user: userData }
    } catch (error: any) {
      const errorMsg = error.data?.errors?.join(', ') || error.data?.message || error.data?.error || 'Signup failed'
      return {
        success: false,
        error: errorMsg
      }
    }
  }

  const isAdmin = () => {
    return user.value?.role === 'admin' || user.value?.role === 'super_admin'
  }

  return {
    isAuthenticated,
    user,
    login,
    logout,
    signup,
    isAdmin
  }
}
