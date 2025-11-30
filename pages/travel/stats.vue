<template>
  <div class="stats-page">
    <section class="stats-hero">
      <div class="container">
        <h1 class="page-title">Travel Statistics</h1>
        <div class="hero-divider"></div>
        <p class="page-subtitle">Insights into your travel patterns and achievements.</p>
      </div>
    </section>

    <section class="stats-content">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ visitedCountries }}</div>
            <div class="stat-label">Visited Countries</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ visitedCities }}</div>
            <div class="stat-label">Visited Cities</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ totalDays }}</div>
            <div class="stat-label">Total Travel Days</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ plans?.length || 0 }}</div>
            <div class="stat-label">Planned Trips</div>
          </div>
        </div>

        <div class="spend-card">
          <h2 class="spend-title">Total Spend</h2>
          <div class="spend-value">${{ totalSpend.toLocaleString() }} USD</div>
          <p class="spend-note">Approximate cost across all documented journeys</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { fetchDiaries } = useTravelDiary()
const { fetchPlans } = useTravelPlan()

const { data: diaries } = await useAsyncData('stats-diaries', () =>
  fetchDiaries().then((res) => res.data)
)
const { data: plans } = await useAsyncData('stats-plans', () =>
  fetchPlans().then((res) => res.data)
)

const visitedCountries = computed(() => {
  const set = new Set((diaries.value || []).map((d) => d.destination.country))
  return set.size
})
const visitedCities = computed(() => (diaries.value || []).length)
const totalDays = computed(() =>
  (diaries.value || []).reduce((days, diary) => {
    const start = new Date(diary.startDate)
    const end = new Date(diary.endDate)
    const diff = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
    return days + diff
  }, 0)
)
const totalSpend = computed(() =>
  (diaries.value || []).reduce((sum, diary) => sum + (diary.expenses?.total || 0), 0)
)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Merriweather:wght@300;400;700&family=Inter:wght@400;500;600&display=swap');

.stats-page {
  min-height: 100vh;
  background-color: #fff;
  font-family: 'Merriweather', serif;
}

.stats-hero {
  padding: 100px 0 60px;
  border-bottom: 1px solid #f0f0f0;
}

.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 60px;
}

.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 4rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 30px;
  letter-spacing: -1px;
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
  max-width: 600px;
}

.stats-content {
  padding: 80px 0 120px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  margin-bottom: 80px;
}

.stat-card {
  text-align: center;
  padding: 40px 20px;
  border-left: 2px solid transparent;
  transition: all 0.4s ease;
}

.stat-card:hover {
  border-left-color: #111;
  padding-left: 40px;
}

.stat-value {
  font-family: 'Playfair Display', serif;
  font-size: 4rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 15px;
  line-height: 1;
}

.stat-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.spend-card {
  text-align: center;
  padding: 60px;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-radius: 8px;
}

.spend-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 600;
  color: #111;
  margin: 0 0 20px;
}

.spend-value {
  font-family: 'Playfair Display', serif;
  font-size: 5rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 15px;
  line-height: 1;
}

.spend-note {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #666;
  margin: 0;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .stat-value {
    font-size: 3rem;
  }

  .spend-value {
    font-size: 3rem;
  }
}
</style>
