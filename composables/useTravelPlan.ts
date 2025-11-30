import type { TravelPlan } from '~/types'

export const useTravelPlan = () => {
  const { get, post, put, del, getLocalized } = useApi()

  const fetchPlans = async () => {
    const res = await getLocalized<{ plans: TravelPlan[] }>('/travel/plans', false)
    return { data: res.plans || [] }
  }

  const fetchPlan = async (id: string) => {
    const res = await getLocalized<{ plan: TravelPlan }>(`/travel/plans/${id}`, false)
    return { data: res.plan }
  }

  const createPlan = async (plan: Partial<TravelPlan>) => {
    return await post<{ data: TravelPlan }>('/api/v1/travel/plans', plan)
  }

  const updatePlan = async (id: string, updates: Partial<TravelPlan>) => {
    return await put<{ data: TravelPlan }>(`/api/v1/travel/plans/${id}`, updates)
  }

  const deletePlan = async (id: string) => {
    return await del<{ success: boolean }>(`/api/v1/travel/plans/${id}`)
  }

  const updateTimeSlotDuration = async (id: string, duration: number) => {
    return await put<{ data: TravelPlan }>(
      `/api/v1/travel/plans/${id}/timeslot`,
      { timeSlotDuration: duration }
    )
  }

  return {
    fetchPlans,
    fetchPlan,
    createPlan,
    updatePlan,
    deletePlan,
    updateTimeSlotDuration
  }
}
