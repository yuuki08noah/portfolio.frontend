<template>
  <NuxtLink :to="`/travel/diary/${diary.id}`" class="diary-card">
    <div v-if="diary.photos.length > 0" class="cover-image">
      <img :src="diary.photos[0]" :alt="displayTitle" />
    </div>
    
    <div class="content">
      <h3>{{ displayTitle }}</h3>
      <p class="destination">
        {{ diary.destination.city }}, {{ diary.destination.country }}
      </p>
      <p class="dates">
        {{ formatDate(diary.startDate) }} - {{ formatDate(diary.endDate) }}
      </p>
      <div v-if="diary.rating" class="rating">
        ⭐ {{ diary.rating }}/5
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { TravelDiary } from '~/types'

const props = defineProps<{
  diary: TravelDiary
}>()

const { t } = useI18n()

const displayTitle = computed(() => t(
  props.diary.title || '',
  props.diary.translations?.ko?.title,
  props.diary.translations?.ja?.title
))

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}
</script>
