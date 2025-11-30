<template>
  <div class="plan-page">
    <section class="plan-hero">
      <div class="container">
        <h1 class="page-title">Travel Plans</h1>
        <div class="hero-divider"></div>
        <p class="page-subtitle">Upcoming adventures with itineraries and checklists.</p>
      </div>
    </section>

    <section class="plan-content">
      <div class="container">
        <div v-if="plans?.length" class="plan-grid">
          <PlanCard v-for="plan in plans" :key="plan.id" :plan="plan" />
        </div>
        <p v-else class="empty-state">No plans yet. Start planning your next journey.</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import PlanCard from '~/components/travel/PlanCard.vue'

const { fetchPlans } = useTravelPlan()

const { data: plans } = await useAsyncData('plans', () =>
  fetchPlans().then((res) => res.data)
)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Merriweather:wght@300;400;700&family=Inter:wght@400;500;600&display=swap');

.plan-page {
  min-height: 100vh;
  background-color: #fff;
  font-family: 'Merriweather', serif;
}

.plan-hero {
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

.plan-content {
  padding: 80px 0 120px;
}

.plan-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
}

.empty-state {
  font-family: 'Inter', sans-serif;
  text-align: center;
  color: #999;
  padding: 80px 0;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }

  .plan-grid {
    grid-template-columns: 1fr;
  }
}
</style>
