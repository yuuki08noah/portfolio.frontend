export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  
  const commentableType = body.commentable_type as string
  const commentableId = body.commentable_id as string
  
  if (!commentableType || !commentableId) {
    throw createError({
      statusCode: 400,
      message: 'Missing commentable_type or commentable_id'
    })
  }
  
  const authHeader = getHeader(event, 'authorization')
  
  const backendUrl = `${config.public.backendApiBase}/api/v1/comments`
  
  try {
    const response = await $fetch(backendUrl, {
      method: 'POST',
      body: {
        comment: body.comment,
        commentable_type: commentableType,
        commentable_id: commentableId
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
      message: error.message || 'Failed to create comment'
    })
  }
})
