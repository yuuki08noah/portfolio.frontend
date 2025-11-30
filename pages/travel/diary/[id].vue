<template>
  <section class="diary-detail container" v-if="diary">
    <header class="hero card">
      <div>
        <p class="eyebrow">Diary</p>
        <h1>{{ displayTitle }}</h1>
        <p class="destination">
          {{ diary.destination.city }}, {{ diary.destination.country }}
        </p>
        <p class="dates">{{ formatDate(diary.startDate) }} - {{ formatDate(diary.endDate) }}</p>
        <div class="meta">
          <span v-if="diary.rating" class="badge">⭐ {{ diary.rating }}/5</span>
          <span class="badge">Public: {{ diary.isPublic ? 'Yes' : 'No' }}</span>
        </div>
        <p v-if="displayDescription" class="description">{{ displayDescription }}</p>
      </div>
      <div v-if="diary.expenses" class="expense">
        <p class="eyebrow">Trip Cost</p>
        <h3>{{ diary.expenses.total }} {{ diary.expenses.currency }}</h3>
        <p class="subtitle">accommodation/food/transport included</p>
      </div>
    </header>

    <PhotoGallery v-if="diary.photos.length" :photos="diary.photos" />

    <div class="card">
      <p class="eyebrow">Itinerary</p>
      <TravelTimeline :items="diary.days">
        <template #item="{ item }">
          <div class="day-card">
            <div class="day-header">
              <span class="badge">Day {{ item.day || item.id }}</span>
              <span class="date">{{ formatDate(item.date) }}</span>
            </div>
            <h3>{{ item.title }}</h3>
            <p class="description">{{ item.content }}</p>
            <ul v-if="item.activities?.length" class="activity-list">
              <li v-for="(activity, idx) in item.activities" :key="idx">• {{ activity }}</li>
            </ul>
            <div v-if="item.locations?.length" class="locations">
              <span v-for="loc in item.locations" :key="loc.name" class="tag">
                📍 {{ loc.name }}
              </span>
            </div>
          </div>
        </template>
      </TravelTimeline>
    </div>
  </section>
  <p v-else class="empty container">Diary not found.</p>
</template>

<script setup lang="ts">
import PhotoGallery from '~/components/travel/PhotoGallery.vue'
import TravelTimeline from '~/components/travel/TravelTimeline.vue'

const route = useRoute()
const { fetchDiary } = useTravelDiary()
const { t } = useI18n()

const id = route.params.id as string
const { data: diary } = await useAsyncData(`diary-${id}`, () =>
  fetchDiary(id).then((res) => res.data)
)

const displayTitle = computed(() => t(
  diary.value?.title || '',
  diary.value?.translations?.ko?.title,
  diary.value?.translations?.ja?.title
))
const displayDescription = computed(() => t(
  diary.value?.description || '',
  diary.value?.translations?.ko?.description,
  diary.value?.translations?.ja?.description
))

const formatDate = (date: string) => new Date(date).toLocaleDateString()
</script>

<style scoped>
.diary-detail {
  padding: var(--spacing-3xl) var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.hero {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-lg);
  align-items: flex-start;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.85rem;
  color: var(--color-accent);
  margin-bottom: var(--spacing-xs);
  font-weight: 700;
}

.destination {
  font-size: 1.2rem;
  color: var(--color-gray-700);
}

.dates {
  color: var(--color-gray-600);
}

.meta {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  margin-top: var(--spacing-sm);
}

.badge {
  padding: 0.35rem 0.75rem;
  background: var(--color-gray-100);
  border-radius: var(--radius-full);
  font-weight: 600;
}

.expense {
  min-width: 220px;
  text-align: right;
}

.card {
  padding: var(--spacing-xl);
}

.day-card {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-gray-200);
  margin-bottom: var(--spacing-lg);
}

.day-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.activity-list {
  list-style: none;
  padding: 0;
  margin: var(--spacing-sm) 0;
}

.locations {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.tag {
  background: var(--color-gray-100);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-full);
}

.empty {
  color: var(--color-gray-600);
}
</style>
