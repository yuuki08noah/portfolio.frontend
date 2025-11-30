<template>
  <div
    class="activity-card"
    :style="cardStyle"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <div class="time-range">
      {{ activity.startTime }} - {{ activity.endTime }}
    </div>
    
    <h4>{{ activity.activity }}</h4>
    
    <p v-if="activity.location" class="location">
      📍 {{ activity.location }}
    </p>
    
    <div class="category-badge" :style="{ backgroundColor: activity.color }">
      {{ activity.category }}
    </div>
    
    <div class="actions">
      <button @click="$emit('update', { ...activity })">Edit</button>
      <button @click="$emit('delete')">Delete</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ItineraryActivity } from '~/types'

const props = defineProps<{
  activity: ItineraryActivity
  slotDuration: number
}>()

const emit = defineEmits<{
  update: [updates: Partial<ItineraryActivity>]
  delete: []
}>()

const { calculateDuration } = useTimeSlot()

const duration = computed(() => 
  calculateDuration(props.activity.startTime, props.activity.endTime)
)

const cardStyle = computed(() => ({
  height: `${(duration.value / props.slotDuration) * 60}px`,
  backgroundColor: props.activity.color || '#e5e7eb'
}))

const handleDragStart = (e: DragEvent) => {
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('activityId', props.activity.id)
  }
}

const handleDragEnd = () => {
}
</script>
