<template>
  <div class="map-page">
    <section class="map-hero">
      <div class="container">
        <h1 class="page-title">Travel Map</h1>
        <div class="hero-divider"></div>
        <p class="page-subtitle">Visualize your journeys across the globe.</p>
      </div>
    </section>

    <section class="map-content">
      <div class="container">
        <div class="map-container">
          <div class="map-placeholder">
            <p class="map-title">Interactive Map</p>
            <p class="map-hint">{{ visited.length }} visited • {{ planned.length }} planned destinations</p>
          </div>
          <div class="legend">
            <span class="legend-item">
              <span class="dot visited"></span>
              Visited
            </span>
            <span class="legend-item">
              <span class="dot planned"></span>
              Planned
            </span>
          </div>
        </div>

        <div class="destinations-grid">
          <div class="destination-panel">
            <h2 class="panel-title">Visited Destinations</h2>
            <ul class="destination-list">
              <li v-for="diary in visited" :key="diary.id" class="destination-item">
                <span class="location-marker">📍</span>
                <span class="location-name">{{ diary.destination.city }}, {{ diary.destination.country }}</span>
              </li>
            </ul>
            <p v-if="!visited.length" class="empty-list">No visited destinations yet.</p>
          </div>

          <div class="destination-panel">
            <h2 class="panel-title">Planned Destinations</h2>
            <ul class="destination-list">
              <li v-for="plan in planned" :key="plan.id" class="destination-item">
                <span class="location-marker">🧭</span>
                <span class="location-name">{{ plan.destination.city }}, {{ plan.destination.country }}</span>
              </li>
            </ul>
            <p v-if="!planned.length" class="empty-list">No planned destinations yet.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { fetchDiaries } = useTravelDiary()
const { fetchPlans } = useTravelPlan()

const { data: diaries } = await useAsyncData('map-diaries', () =>
  fetchDiaries().then((res) => res.data)
)
const { data: plans } = await useAsyncData('map-plans', () =>
  fetchPlans().then((res) => res.data)
)

const visited = computed(() => diaries.value || [])
const planned = computed(() => plans.value || [])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Merriweather:wght@300;400;700&family=Inter:wght@400;500;600&display=swap');

.map-page {
  min-height: 100vh;
  background-color: #fff;
  font-family: 'Merriweather', serif;
}

.map-hero {
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

.map-content {
  padding: 80px 0 120px;
}

.map-container {
  margin-bottom: 60px;
}

.map-placeholder {
  height: 400px;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.map-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  color: #111;
  margin: 0 0 10px;
}

.map-hint {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #666;
}

.legend {
  display: flex;
  gap: 30px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.visited {
  background: #22c55e;
}

.dot.planned {
  background: #f59e0b;
}

.destinations-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 60px;
}

.destination-panel {
  border-left: 2px solid #111;
  padding-left: 30px;
}

.panel-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 600;
  color: #111;
  margin: 0 0 30px;
}

.destination-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.destination-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Inter', sans-serif;
  color: #333;
  transition: all 0.3s ease;
  padding-left: 0;
}

.destination-item:hover {
  padding-left: 10px;
  color: #111;
}

.location-marker {
  font-size: 1.2rem;
  filter: grayscale(100%);
  transition: filter 0.3s ease;
}

.destination-item:hover .location-marker {
  filter: grayscale(0%);
}

.location-name {
  font-size: 1rem;
}

.empty-list {
  font-family: 'Inter', sans-serif;
  color: #999;
  font-style: italic;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }

  .destinations-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
</style>
