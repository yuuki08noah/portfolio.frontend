<template>
  <section class="reading-goals-page container">
    <header class="page-header">
      <h1>🎫 Reading Goals</h1>
      <p class="subtitle">Track yearly tickets and pace to stay on course.</p>
    </header>

    <div class="goals-grid">
      <ReadingGoalTracker v-for="goal in goals || []" :key="goal.id" :goal="goal" />
    </div>
  </section>
</template>

<script setup lang="ts">
import ReadingGoalTracker from '~/components/reading/ReadingGoalTracker.vue'

const { fetchReadingGoals } = useReading()

const { data: goals } = await useAsyncData('reading-goals', () =>
  fetchReadingGoals().then((res) => res.data)
)
</script>

<style scoped>
.reading-goals-page {
  padding: var(--spacing-3xl) var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.page-header {
  text-align: center;
}

.subtitle {
  color: var(--color-gray-600);
}

.goals-grid {
  display: grid;
  gap: var(--spacing-lg);
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
</style>
