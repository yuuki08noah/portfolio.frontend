<template>
  <div class="travel-page">
    <!-- Hero Section -->
    <section class="travel-hero">
      <div class="container">
        <h1 class="page-title">Travel</h1>
        <div class="hero-divider"></div>
        <p class="page-subtitle">Adventures and discoveries around the world.</p>
      </div>
    </section>

    <!-- Quick Stats -->
    <section class="travel-stats">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ stats.countriesVisited }}</div>
            <div class="stat-label">Countries Visited</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ stats.tripsCompleted }}</div>
            <div class="stat-label">Trips Completed</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ stats.daysTravel }}</div>
            <div class="stat-label">Days Traveled</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ stats.nextTrip || 'TBD' }}</div>
            <div class="stat-label">Next Adventure</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Access Cards -->
    <section class="quick-access">
      <div class="container">
        <h2 class="section-title">Explore</h2>
        <div class="access-grid">
          <NuxtLink to="/travel/diary" class="access-card">
            <div class="card-icon">🌍</div>
            <h3 class="card-title">Travel Diary</h3>
            <p class="card-description">Record and relive your adventures</p>
            <span class="card-arrow">→</span>
          </NuxtLink>

          <NuxtLink to="/travel/plan" class="access-card">
            <div class="card-icon">📝</div>
            <h3 class="card-title">Travel Plans</h3>
            <p class="card-description">Plan your next journey with itineraries</p>
            <span class="card-arrow">→</span>
          </NuxtLink>

          <NuxtLink to="/travel/map" class="access-card">
            <div class="card-icon">🗺️</div>
            <h3 class="card-title">Travel Map</h3>
            <p class="card-description">Visualize your journeys on the map</p>
            <span class="card-arrow">→</span>
          </NuxtLink>

          <NuxtLink to="/travel/stats" class="access-card">
            <div class="card-icon">📊</div>
            <h3 class="card-title">Statistics</h3>
            <p class="card-description">Insights into your travel patterns</p>
            <span class="card-arrow">→</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Recent Content -->
    <section class="recent-content">
      <div class="container">
        <div class="content-columns">
          <!-- Recent Diaries -->
          <div class="content-panel">
            <div class="panel-header">
              <h2 class="panel-title">Recent Diaries</h2>
              <NuxtLink to="/travel/diary" class="view-all">View All</NuxtLink>
            </div>
            <div v-if="diaryHighlights.length" class="diary-list">
              <DiaryCard v-for="diary in diaryHighlights" :key="diary.id" :diary="diary" />
            </div>
            <p v-else class="empty-state">No diaries yet. Start documenting your travels.</p>
          </div>

          <!-- Upcoming Plans -->
          <div class="content-panel">
            <div class="panel-header">
              <h2 class="panel-title">Upcoming Plans</h2>
              <NuxtLink to="/travel/plan" class="view-all">View All</NuxtLink>
            </div>
            <div v-if="planHighlights.length" class="plan-list">
              <PlanCard v-for="plan in planHighlights" :key="plan.id" :plan="plan" />
            </div>
            <p v-else class="empty-state">No plans yet. Start planning your next adventure.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import DiaryCard from '~/components/travel/DiaryCard.vue'
import PlanCard from '~/components/travel/PlanCard.vue'

const { $api } = useNuxtApp()
const { fetchDiaries } = useTravelDiary()
const { fetchPlans } = useTravelPlan()

const { data: diaries } = await useAsyncData('travel-diaries', () =>
  fetchDiaries().then((res) => res.data)
)
const { data: plans } = await useAsyncData('travel-plans', () =>
  fetchPlans().then((res) => res.data)
)

// Fetch stats from API
const { data: statsData } = await useAsyncData('travel-stats', async () => {
  try {
    const res = await $api('/api/v1/travel/stats')
    return res.stats
  } catch (e) {
    return null
  }
})

const diaryHighlights = computed(() => (diaries.value || []).slice(0, 3))
const planHighlights = computed(() => (plans.value || []).slice(0, 3))

// Stats from DB
const stats = computed(() => ({
  countriesVisited: statsData.value?.countries_visited || 0,
  tripsCompleted: statsData.value?.trips_completed || 0,
  daysTravel: statsData.value?.days_traveled || 0,
  nextTrip: statsData.value?.next_trip || 'TBD'
}))
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Merriweather:wght@300;400;700&family=Inter:wght@400;500;600&display=swap');

.travel-page {
  min-height: 100vh;
  background-color: #fff;
  color: #111;
  font-family: 'Merriweather', serif;
}

/* Hero Section */
.travel-hero {
  padding: 100px 0 60px;
  background-color: #fff;
  color: #111;
  border-bottom: 1px solid #f0f0f0;
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
}

.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 4rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 30px;
  letter-spacing: -1px;
  line-height: 1;
}

.hero-divider {
  width: 60px;
  height: 2px;
  background-color: #111;
  margin-bottom: 20px;
}

.page-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  color: #666;
  font-weight: 400;
  max-width: 600px;
  line-height: 1.6;
}

/* Stats Section */
.travel-stats {
  padding: 60px 0;
  border-bottom: 1px solid #f0f0f0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

.stat-card {
  text-align: center;
}

.stat-value {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 10px;
}

.stat-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Quick Access */
.quick-access {
  padding: 80px 0;
  border-bottom: 1px solid #f0f0f0;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 600;
  color: #111;
  margin-bottom: 40px;
}

.access-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.access-card {
  display: block;
  padding: 40px 30px;
  background: transparent;
  border-left: 1px solid transparent;
  text-decoration: none;
  color: inherit;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
}

.access-card:hover {
  border-left-color: #111;
  padding-left: 50px;
}

.access-card:hover .card-arrow {
  opacity: 1;
  transform: translateX(0);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 20px;
  filter: grayscale(100%);
  transition: filter 0.4s ease;
}

.access-card:hover .card-icon {
  filter: grayscale(0%);
}

.card-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111;
  margin: 0 0 10px;
}

.card-description {
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
}

.card-arrow {
  font-family: 'Inter', sans-serif;
  font-size: 1.2rem;
  color: #111;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.4s ease;
  position: absolute;
  bottom: 40px;
  right: 30px;
}

/* Recent Content */
.recent-content {
  padding: 80px 0 120px;
}

.content-columns {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 60px;
}

.content-panel {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #111;
  padding-bottom: 15px;
}

.panel-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 600;
  color: #111;
  margin: 0;
}

.view-all {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #111;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: opacity 0.3s ease;
}

.view-all:hover {
  opacity: 0.6;
}

.diary-list,
.plan-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.empty-state {
  font-family: 'Inter', sans-serif;
  color: #999;
  text-align: center;
  padding: 40px 0;
}

/* Responsive */
@media (max-width: 1200px) {
  .stats-grid,
  .access-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 3.5rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .access-grid {
    grid-template-columns: 1fr;
  }

  .content-columns {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
</style>
