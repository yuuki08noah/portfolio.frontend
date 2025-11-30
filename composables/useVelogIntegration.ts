import type { DocumentVelogStats, VelogPost } from '~/types'

export const useVelogIntegration = () => {
  const { get, post } = useApi()

  const syncVelogStats = async (documentId: string) => {
    return await post<{ data: DocumentVelogStats }>(`/api/v1/velog/sync/${documentId}`)
  }

  const syncAllVelogStats = async (projectSlug: string) => {
    return await post<{ data: DocumentVelogStats[] }>(`/api/v1/velog/sync/project/${projectSlug}`)
  }

  const fetchVelogPost = async (velogUrl: string) => {
    return await post<{ data: VelogPost }>('/api/v1/velog/fetch', { velogUrl })
  }

  const publishToVelog = async (documentId: string) => {
    return await post<{ data: VelogPost }>(`/api/v1/velog/publish/${documentId}`)
  }

  const getVelogStats = async (documentId: string) => {
    return await get<{ data: DocumentVelogStats }>(`/api/v1/velog/stats/${documentId}`)
  }

  const fetchVelogPosts = async (username: string) => {
    return await get<{ data: VelogPost[] }>(`/api/v1/velog/posts/${username}`, false)
  }

  return {
    syncVelogStats,
    syncAllVelogStats,
    fetchVelogPost,
    publishToVelog,
    getVelogStats,
    fetchVelogPosts
  }
}
