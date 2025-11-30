<template>
  <form class="diary-editor" @submit.prevent="handleSubmit">
    <input v-model="diary.title" type="text" placeholder="Travel Title" required />
    
    <div class="destination-inputs">
      <input v-model="diary.destination.country" type="text" placeholder="Country" required />
      <input v-model="diary.destination.city" type="text" placeholder="City" required />
    </div>
    
    <div class="date-inputs">
      <input v-model="diary.startDate" type="date" required />
      <input v-model="diary.endDate" type="date" required />
    </div>
    
    <textarea v-model="diary.description" placeholder="Description" rows="4" />
    
    <div class="rating-input">
      <label>Rating:</label>
      <input v-model.number="diary.rating" type="number" min="1" max="5" />
    </div>
    
    <button type="submit" class="submit-btn">Save Diary</button>
  </form>
</template>

<script setup lang="ts">
import type { TravelDiary } from '~/types'

const props = defineProps<{
  initialDiary?: Partial<TravelDiary>
}>()

const emit = defineEmits<{
  submit: [diary: Partial<TravelDiary>]
}>()

const diary = reactive<Partial<TravelDiary>>({
  title: '',
  destination: {
    country: '',
    city: '',
    countryCode: ''
  },
  startDate: '',
  endDate: '',
  description: '',
  rating: undefined,
  days: [],
  photos: [],
  isPublic: true,
  ...props.initialDiary
})

const handleSubmit = () => {
  emit('submit', diary)
}
</script>
