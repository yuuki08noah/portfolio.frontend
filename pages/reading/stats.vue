<template>
  <section class="reading-stats-page container">
    <header class="page-header">
      <h1>📈 Reading Statistics</h1>
      <p class="subtitle">A quick pulse on pace, categories, and averages.</p>
    </header>

    <ReadingStats :stats="stats" />
  </section>
</template>

<script setup lang="ts">
import ReadingStats from '~/components/reading/ReadingStats.vue'

const { fetchReadingStats } = useReading()

const { data: stats } = await useAsyncData('reading-stats', () =>
  fetchReadingStats().then((res) => res.data)
)
</script>

<style scoped>
.reading-stats-page {
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
</style>
