<template>
  <div class="itinerary-timeline">
    <div class="timeline-header">
      <h3>Day {{ day.day }} Itinerary</h3>
      <TimeSlotSelector v-model="slotDuration" />
    </div>
    
    <TimeSlotGrid
      :activities="day.activities"
      :slot-duration="slotDuration"
      @add-activity="handleAddActivity"
      @update-activity="handleUpdateActivity"
      @delete-activity="handleDeleteActivity"
    />
  </div>
</template>

<script setup lang="ts">
import type { ItineraryDay, ItineraryActivity } from '~/types'

const props = defineProps<{
  day: ItineraryDay
  planId: string
}>()

const emit = defineEmits<{
  'activity-added': [activity: ItineraryActivity]
  'activity-updated': [activity: ItineraryActivity]
  'activity-deleted': [activityId: string]
}>()

const slotDuration = ref(30)
const { createActivity, updateActivity, deleteActivity } = useItinerary()

const handleAddActivity = async (activity: Partial<ItineraryActivity>) => {
  const response = await createActivity(props.planId, activity)
  emit('activity-added', response.data)
}

const handleUpdateActivity = async (activityId: string, updates: Partial<ItineraryActivity>) => {
  const response = await updateActivity(props.planId, activityId, updates)
  emit('activity-updated', response.data)
}

const handleDeleteActivity = async (activityId: string) => {
  await deleteActivity(props.planId, activityId)
  emit('activity-deleted', activityId)
}
</script>
