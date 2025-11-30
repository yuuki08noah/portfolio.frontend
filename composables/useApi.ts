// Global API client with authentication
export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.backendApiBase as string
  const { locale } = useI18n()

  const getAuthHeaders = (): Record<string, string> => {
    if (process.client) {
      const token = localStorage.getItem('auth_token')
      if (token) {
        return { Authorization: `Bearer ${token}` }
      }
    }
    return {}
  }

  // Get locale-prefixed endpoint for content APIs
  const getLocalizedEndpoint = (endpoint: string, useLocale = false): string => {
    if (!useLocale) return endpoint
    
    // Content APIs that support localization
    const localizablePatterns = [
      '/portfolio/',
      '/reading/',
      '/travel/',
      '/site_settings'
    ]
    
    const isLocalizable = localizablePatterns.some(pattern => endpoint.startsWith(pattern))
    if (isLocalizable) {
      return `/api/v1/${locale.value}${endpoint}`
    }
    return endpoint
  }

  const $api = async <T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
      body?: any
      headers?: Record<string, string>
      auth?: boolean
      localized?: boolean
    } = {}
  ): Promise<T> => {
    const { method = 'GET', body, headers = {}, auth = true, localized = false } = options

    const fetchOptions: any = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...(auth ? getAuthHeaders() : {})
      }
    }

    if (body && method !== 'GET') {
      fetchOptions.body = JSON.stringify(body)
    }

    const finalEndpoint = getLocalizedEndpoint(endpoint, localized)
    const url = `${apiBase}${finalEndpoint}`
    return await $fetch<T>(url, fetchOptions)
  }

  // Convenience methods
  const get = <T>(endpoint: string, auth = true, localized = false) => 
    $api<T>(endpoint, { method: 'GET', auth, localized })

  const post = <T>(endpoint: string, body?: any, auth = true) => 
    $api<T>(endpoint, { method: 'POST', body, auth })

  const put = <T>(endpoint: string, body?: any, auth = true) => 
    $api<T>(endpoint, { method: 'PUT', body, auth })

  const patch = <T>(endpoint: string, body?: any, auth = true) => 
    $api<T>(endpoint, { method: 'PATCH', body, auth })

  const del = <T>(endpoint: string, auth = true) => 
    $api<T>(endpoint, { method: 'DELETE', auth })

  // Localized get (for content that needs i18n)
  const getLocalized = <T>(endpoint: string, auth = true) => 
    $api<T>(endpoint, { method: 'GET', auth, localized: true })

  return {
    apiBase,
    getAuthHeaders,
    $api,
    get,
    post,
    put,
    patch,
    del,
    getLocalized
  }
}
