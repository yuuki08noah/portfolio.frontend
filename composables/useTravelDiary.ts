import type { TravelDiary } from '~/types'

export const useTravelDiary = () => {
  const { get, post, put, del, getLocalized } = useApi()

  const fetchDiaries = async () => {
    const res = await getLocalized<{ diaries: TravelDiary[] }>('/travel/diaries', false)
    return { data: res.diaries || [] }
  }

  const fetchDiary = async (id: string) => {
    const res = await getLocalized<{ diary: TravelDiary }>(`/travel/diaries/${id}`, false)
    return { data: res.diary }
  }

  const createDiary = async (diary: Partial<TravelDiary>) => {
    return await post<{ data: TravelDiary }>('/api/v1/travel/diaries', diary)
  }

  const updateDiary = async (id: string, updates: Partial<TravelDiary>) => {
    return await put<{ data: TravelDiary }>(`/api/v1/travel/diaries/${id}`, updates)
  }

  const deleteDiary = async (id: string) => {
    return await del<{ success: boolean }>(`/api/v1/travel/diaries/${id}`)
  }

  return {
    fetchDiaries,
    fetchDiary,
    createDiary,
    updateDiary,
    deleteDiary
  }
}
