<template>
  <div class="time-slot-grid">
    <div class="time-column">
      <div v-for="slot in timeSlots" :key="slot" class="time-slot">
        {{ slot }}
      </div>
    </div>
    
    <div class="activities-column">
      <ActivityCard
        v-for="activity in activities"
        :key="activity.id"
        :activity="activity"
        :slot-duration="slotDuration"
        @update="(updates) => $emit('update-activity', activity.id, updates)"
        @delete="$emit('delete-activity', activity.id)"
      />
      
      <button @click="showAddDialog = true" class="add-activity-btn">
        + Add Activity
      </button>
    </div>
    
    <ActivityDialog
      v-if="showAddDialog"
      @submit="handleAddActivity"
      @close="showAddDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import type { ItineraryActivity } from '~/types'

const props = defineProps<{
  activities: ItineraryActivity[]
  slotDuration: number
}>()

const emit = defineEmits<{
  'add-activity': [activity: Partial<ItineraryActivity>]
  'update-activity': [activityId: string, updates: Partial<ItineraryActivity>]
  'delete-activity': [activityId: string]
}>()

const { getTimeSlots } = useTimeSlot()
const showAddDialog = ref(false)

const timeSlots = computed(() => getTimeSlots(0, 24))

const handleAddActivity = (activity: Partial<ItineraryActivity>) => {
  emit('add-activity', activity)
  showAddDialog.value = false
}
</script>
