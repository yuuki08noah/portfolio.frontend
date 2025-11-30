<template>
  <div class="activity-category-picker">
    <label>Category:</label>
    <div class="categories">
      <button
        v-for="cat in categories"
        :key="cat.value"
        :class="{ active: modelValue === cat.value }"
        :style="{ borderColor: cat.color }"
        @click="$emit('update:modelValue', cat.value)"
      >
        {{ cat.icon }} {{ cat.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ItineraryActivity } from '~/types'

defineProps<{
  modelValue?: ItineraryActivity['category']
}>()

defineEmits<{
  'update:modelValue': [value: ItineraryActivity['category']]
}>()

const categories = [
  { value: 'transportation', label: 'Transportation', icon: '🚗', color: '#3b82f6' },
  { value: 'meal', label: 'Meal', icon: '🍽️', color: '#f97316' },
  { value: 'sightseeing', label: 'Sightseeing', icon: '🏛️', color: '#10b981' },
  { value: 'accommodation', label: 'Accommodation', icon: '🏨', color: '#8b5cf6' },
  { value: 'other', label: 'Other', icon: '📌', color: '#6b7280' }
] as const
</script>
