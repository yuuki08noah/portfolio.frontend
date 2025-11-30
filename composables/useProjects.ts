import type { PortfolioProject, ProjectBlogPost } from '~/types/portfolio'

export interface ProjectsResponse {
  projects: PortfolioProject[]
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ProjectResponse {
  project: PortfolioProject
}

export interface ProjectDocsResponse {
  docs: ProjectBlogPost[]
}

export interface ProjectDocResponse {
  doc: ProjectBlogPost
}

export const useProjects = () => {
  const { get, post, patch, del } = useApi()

  // Project CRUD
  const fetchProjects = async (params?: {
    page?: number
    limit?: number
    sort?: string
    order?: 'asc' | 'desc'
    search?: string
  }) => {
    const query = new URLSearchParams()
    if (params?.page) query.set('page', String(params.page))
    if (params?.limit) query.set('limit', String(params.limit))
    if (params?.sort) query.set('sort', params.sort)
    if (params?.order) query.set('order', params.order)
    if (params?.search) query.set('search', params.search)

    const endpoint = `/api/v1/portfolio/projects${query.toString() ? `?${query}` : ''}`
    return await get<ProjectsResponse>(endpoint, false)
  }

  const fetchProject = async (slug: string) => {
    return await get<ProjectResponse>(`/api/v1/portfolio/projects/${slug}`, false)
  }

  const createProject = async (data: {
    title: string
    description: string
    stack: string[]
    itinerary?: string[]
    souvenirs?: string[]
    demo_url?: string
    repo_url?: string
    start_date?: string
    end_date?: string
    is_ongoing?: boolean
  }) => {
    return await post<ProjectResponse>('/api/v1/portfolio/projects', data)
  }

  const updateProject = async (slug: string, data: Partial<{
    title: string
    description: string
    stack: string[]
    itinerary?: string[]
    souvenirs?: string[]
    demo_url?: string
    repo_url?: string
    start_date?: string
    end_date?: string
    is_ongoing?: boolean
  }>) => {
    return await patch<ProjectResponse>(`/api/v1/portfolio/projects/${slug}`, data)
  }

  const deleteProject = async (slug: string) => {
    return await del(`/api/v1/portfolio/projects/${slug}`)
  }

  // Project Documents CRUD
  const fetchProjectDocs = async (projectSlug: string, category?: string) => {
    const endpoint = category
      ? `/api/v1/portfolio/projects/${projectSlug}/docs/${category}`
      : `/api/v1/portfolio/projects/${projectSlug}/docs`
    return await get<ProjectDocsResponse>(endpoint, false)
  }

  const fetchProjectDoc = async (projectSlug: string, category: string, docSlug: string) => {
    return await get<ProjectDocResponse>(
      `/api/v1/portfolio/projects/${projectSlug}/docs/${category}/${docSlug}`,
      false
    )
  }

  const createProjectDoc = async (
    projectSlug: string,
    data: {
      title: string
      content: string
      category: string
      order?: number
      velog_url?: string
      velog_post_id?: string
    }
  ) => {
    return await post<ProjectDocResponse>(
      `/api/v1/portfolio/projects/${projectSlug}/docs`,
      data
    )
  }

  const updateProjectDoc = async (
    projectSlug: string,
    category: string,
    docSlug: string,
    data: Partial<{
      title: string
      content: string
      category: string
      order: number
      velog_url: string
      velog_post_id: string
    }>
  ) => {
    return await patch<ProjectDocResponse>(
      `/api/v1/portfolio/projects/${projectSlug}/docs/${category}/${docSlug}`,
      data
    )
  }

  const deleteProjectDoc = async (projectSlug: string, category: string, docSlug: string) => {
    return await del(
      `/api/v1/portfolio/projects/${projectSlug}/docs/${category}/${docSlug}`
    )
  }

  // Image upload (needs special handling for FormData)
  const uploadProjectImage = async (projectSlug: string, file: File) => {
    const { apiBase, getAuthHeaders } = useApi()
    const formData = new FormData()
    formData.append('image', file)

    return await $fetch<{ url: string }>(
      `${apiBase}/api/v1/portfolio/projects/${projectSlug}/images`,
      {
        method: 'POST',
        body: formData,
        headers: getAuthHeaders()
      }
    )
  }

  const deleteProjectImage = async (projectSlug: string, imageId: string) => {
    return await del(`/api/v1/portfolio/projects/${projectSlug}/images/${imageId}`)
  }

  return {
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    fetchProjectDocs,
    fetchProjectDoc,
    createProjectDoc,
    updateProjectDoc,
    deleteProjectDoc,
    uploadProjectImage,
    deleteProjectImage
  }
}
