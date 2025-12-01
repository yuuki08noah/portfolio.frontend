export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  
  const commentableType = query.commentable_type as string
  const commentableId = query.commentable_id as string
  const locale = query.locale as string || 'en'
  const authHeader = getHeader(event, 'authorization')
  
  if (!commentableType || !commentableId) {
    throw createError({
      statusCode: 400,
      message: 'Missing commentable_type or commentable_id'
    })
  }
  
  const backendUrl = `${config.public.backendApiBase}/api/v1/comments?commentable_type=${commentableType}&commentable_id=${commentableId}&locale=${locale}`
  
  try {
    const response = await $fetch(backendUrl, {
      headers: {
        'Accept': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {})
      }
    })
    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch comments'
    })
  }
})
