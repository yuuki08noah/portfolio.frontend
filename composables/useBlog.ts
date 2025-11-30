import type { BlogPost, Category, Tag } from '~/types'

export const useBlog = () => {
  const { get, post, put, del } = useApi()

  const fetchPosts = async (params?: {
    category?: string
    tag?: string
    status?: BlogPost['status']
    page?: number
    limit?: number
  }) => {
    const query = new URLSearchParams()
    if (params?.category) query.set('category', params.category)
    if (params?.tag) query.set('tag', params.tag)
    if (params?.status) query.set('status', params.status)
    if (params?.page) query.set('page', String(params.page))
    if (params?.limit) query.set('limit', String(params.limit))
    const endpoint = `/api/v1/blog/posts${query.toString() ? `?${query}` : ''}`
    const response = await get<{ posts: BlogPost[]; pagination?: any }>(endpoint, false)
    return { data: response.posts, pagination: response.pagination }
  }

  const fetchPost = async (slug: string) => {
    const response = await get<{ post: BlogPost }>(`/api/v1/blog/posts/${slug}`, false)
    return { data: response.post }
  }

  const createPost = async (postData: Partial<BlogPost>) => {
    const response = await post<{ post: BlogPost }>('/api/v1/blog/posts', postData)
    return { data: response.post }
  }

  const updatePost = async (id: string, updates: Partial<BlogPost>) => {
    const response = await put<{ post: BlogPost }>(`/api/v1/blog/posts/${id}`, updates)
    return { data: response.post }
  }

  const deletePost = async (id: string) => {
    return await del<{ success: boolean }>(`/api/v1/blog/posts/${id}`)
  }

  const publishPost = async (id: string) => {
    return await post<{ data: BlogPost }>(`/api/v1/blog/posts/${id}/publish`)
  }

  const incrementViews = async (id: string) => {
    return await post<{ success: boolean }>(`/api/v1/blog/posts/${id}/view`, undefined, false)
  }

  const fetchCategories = async () => {
    const response = await get<{ categories: Category[] }>('/api/v1/blog/categories', false)
    return { data: response.categories || [] }
  }

  const fetchTags = async () => {
    const response = await get<{ tags: Tag[] }>('/api/v1/blog/tags', false)
    return { data: response.tags || [] }
  }

  const searchPosts = async (query: string) => {
    const response = await get<{ posts: BlogPost[] }>(`/api/v1/blog/search?q=${encodeURIComponent(query)}`, false)
    return { data: response.posts || [] }
  }

  return {
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    publishPost,
    incrementViews,
    fetchCategories,
    fetchTags,
    searchPosts
  }
}
