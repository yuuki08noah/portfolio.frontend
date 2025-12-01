<template>
  <NuxtLink :to="`/travel/diary/${diary.id}`" class="diary-card">
    <div v-if="coverPhoto" class="cover-image">
      <img :src="coverPhoto" :alt="displayTitle" />
    </div>
    
    <div class="content">
      <h3>{{ displayTitle }}</h3>
      <p class="destination">
        {{ diary.destination?.city || diary.destination_city }}, {{ diary.destination?.country || diary.destination_country }}
      </p>
      <p class="dates">
        {{ formatDate(diary.start_date || diary.startDate) }} - {{ formatDate(diary.end_date || diary.endDate) }}
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
  diary: TravelDiary & { 
    start_date?: string
    end_date?: string
    destination_city?: string
    destination_country?: string
  }
}>()

const { t } = useI18n()

const displayTitle = computed(() => t(
  props.diary.title || '',
  props.diary.translations?.ko?.title,
  props.diary.translations?.ja?.title
))

const coverPhoto = computed(() => {
  const photos = props.diary.photos
  if (Array.isArray(photos) && photos.length > 0) {
    return photos[0]
  }
  return null
})

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}
</script>

<style scoped>
.diary-card {
  display: block;
  text-decoration: none;
  color: inherit;
  background: #fff;
  border: 1px solid #e5e5e5;
  transition: all 0.3s ease;
}

.diary-card:hover {
  border-color: #111;
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.cover-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.cover-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.diary-card:hover .cover-image img {
  transform: scale(1.05);
}

.content {
  padding: 24px;
}

.content h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111;
  margin: 0 0 12px;
  line-height: 1.3;
}

.destination {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dates {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #999;
  margin: 0 0 12px;
}

.rating {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #111;
}
</style>
