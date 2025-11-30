import type { ItineraryActivity } from '~/types'

export const useItinerary = () => {
  const fetchActivities = async (planId: string) => {
    return await $fetch<{ data: ItineraryActivity[] }>(
      `/api/travel/plans/${planId}/activities`
    )
  }

  const createActivity = async (
    planId: string,
    activity: Partial<ItineraryActivity>
  ) => {
    return await $fetch<{ data: ItineraryActivity }>(
      `/api/travel/plans/${planId}/activities`,
      {
        method: 'POST',
        body: activity
      }
    )
  }

  const updateActivity = async (
    planId: string,
    activityId: string,
    updates: Partial<ItineraryActivity>
  ) => {
    return await $fetch<{ data: ItineraryActivity }>(
      `/api/travel/plans/${planId}/activities/${activityId}`,
      {
        method: 'PUT',
        body: updates
      }
    )
  }

  const deleteActivity = async (planId: string, activityId: string) => {
    return await $fetch<{ success: boolean }>(
      `/api/travel/plans/${planId}/activities/${activityId}`,
      {
        method: 'DELETE'
      }
    )
  }

  const checkTimeConflict = async (
    planId: string,
    startTime: string,
    endTime: string,
    excludeActivityId?: string
  ) => {
    return await $fetch<{ hasConflict: boolean; conflicts?: ItineraryActivity[] }>(
      `/api/travel/plans/${planId}/activities/check-conflict`,
      {
        method: 'POST',
        body: { startTime, endTime, excludeActivityId }
      }
    )
  }

  const duplicateActivity = async (planId: string, activityId: string) => {
    return await $fetch<{ data: ItineraryActivity }>(
      `/api/travel/plans/${planId}/activities/${activityId}/duplicate`,
      {
        method: 'POST'
      }
    )
  }

  return {
    fetchActivities,
    createActivity,
    updateActivity,
    deleteActivity,
    checkTimeConflict,
    duplicateActivity
  }
}
