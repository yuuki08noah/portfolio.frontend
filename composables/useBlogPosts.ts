export const useBlogPosts = () => {
  const { $api } = useApi()

  const fetchBlogPosts = async (params?: { status?: string; category_id?: string; tag?: string; q?: string; auth?: boolean }) => {
    const query = new URLSearchParams()
    if (params?.status) query.append('status', params.status)
    if (params?.category_id) query.append('category_id', params.category_id)
    if (params?.tag) query.append('tag', params.tag)
    if (params?.q) query.append('q', params.q)

    const queryString = query.toString()
    const requireAuth = params?.auth !== undefined ? params.auth : true
    return await $api(`/api/v1/blog/posts${queryString ? `?${queryString}` : ''}`, { method: 'GET', auth: requireAuth })
  }

  const fetchBlogPost = async (id: string, auth: boolean = false) => {
    return await $api(`/api/v1/blog/posts/${id}`, { method: 'GET', auth })
  }

  const createBlogPost = async (data: any) => {
    return await $api('/api/v1/blog/posts', { method: 'POST', body: data, auth: true })
  }

  const updateBlogPost = async (id: string, data: any) => {
    return await $api(`/api/v1/blog/posts/${id}`, { method: 'PUT', body: data, auth: true })
  }

  const deleteBlogPost = async (id: string) => {
    return await $api(`/api/v1/blog/posts/${id}`, { method: 'DELETE', auth: true })
  }

  return {
    fetchBlogPosts,
    fetchBlogPost,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost
  }
}
