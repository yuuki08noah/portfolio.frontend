import type { ProjectDocument, ProjectBlog } from '~/types'

export const useProjectBlog = () => {
  const fetchProjectDocs = async (projectSlug: string, category?: string) => {
    const endpoint = category
      ? `/api/blog/projects/${projectSlug}/${category}`
      : `/api/blog/projects/${projectSlug}`
    
    return await $fetch<{ data: ProjectDocument[] }>(endpoint)
  }

  const fetchProjectDoc = async (
    projectSlug: string,
    category: string,
    slug: string
  ) => {
    return await $fetch<{ data: ProjectDocument }>(
      `/api/blog/projects/${projectSlug}/${category}/${slug}`
    )
  }

  const createProjectDoc = async (
    projectSlug: string,
    doc: Partial<ProjectDocument>
  ) => {
    return await $fetch<{ data: ProjectDocument }>(
      `/api/blog/projects/${projectSlug}/docs`,
      {
        method: 'POST',
        body: doc
      }
    )
  }

  const updateProjectDoc = async (
    projectSlug: string,
    docId: string,
    updates: Partial<ProjectDocument>
  ) => {
    return await $fetch<{ data: ProjectDocument }>(
      `/api/blog/projects/${projectSlug}/docs/${docId}`,
      {
        method: 'PUT',
        body: updates
      }
    )
  }

  const deleteProjectDoc = async (projectSlug: string, docId: string) => {
    return await $fetch<{ success: boolean }>(
      `/api/blog/projects/${projectSlug}/docs/${docId}`,
      {
        method: 'DELETE'
      }
    )
  }

  return {
    fetchProjectDocs,
    fetchProjectDoc,
    createProjectDoc,
    updateProjectDoc,
    deleteProjectDoc
  }
}
