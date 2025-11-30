import { getRequestHeader, H3Event } from 'h3'

export async function backendFetch<T = unknown>(
  event: H3Event,
  path: string,
  options: Record<string, any> = {}
): Promise<T> {
  const config = useRuntimeConfig()
  const base = config.backendApiBase || config.public.backendApiBase || 'http://localhost:4000'
  const headers = { ...(options.headers || {}) }
  const authHeader = getRequestHeader(event, 'authorization')

  if (authHeader && !headers.authorization) {
    headers.authorization = authHeader
  }

  return await $fetch<T>(`${base}${path}`, {
    ...options,
    headers
  })
}
