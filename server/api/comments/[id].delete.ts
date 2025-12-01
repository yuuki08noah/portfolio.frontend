export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const authHeader = getHeader(event, 'authorization')
  
  const backendUrl = `${config.public.backendApiBase}/api/v1/comments/${id}`
  
  try {
    const response = await $fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {})
      }
    })
    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to delete comment'
    })
  }
})
