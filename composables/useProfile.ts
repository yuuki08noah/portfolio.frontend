export default function useProfile() {
  const { get } = useApi()

  const fetchProfile = async () => {
    const response = await get<{ profile: any }>('/api/v1/portfolio/profile')
    return response
  }

  const fetchAwards = async () => {
    const response = await get<{ awards: any[] }>('/api/v1/portfolio/awards')
    return response
  }

  return {
    fetchProfile,
    fetchAwards
  }
}
