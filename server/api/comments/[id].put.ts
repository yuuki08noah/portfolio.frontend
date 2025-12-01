export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const authHeader = getHeader(event, 'authorization')
  
  const backendUrl = `${config.public.backendApiBase}/api/v1/comments/${id}`
  
  try {
    const response = await $fetch(backendUrl, {
      method: 'PUT',
      body: {
        content: body.content
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {})
      }
    })
    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to update comment'
    })
  }
})
