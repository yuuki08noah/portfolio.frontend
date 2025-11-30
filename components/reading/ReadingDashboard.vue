<template>
  <div class="reading-dashboard">
    <h1>Reading Dashboard</h1>
    
    <div class="stats-overview">
      <div class="stat-card">
        <h3>Total Books</h3>
        <p class="value">{{ totalBooks }}</p>
      </div>
      <div class="stat-card">
        <h3>Currently Reading</h3>
        <p class="value">{{ readingCount }}</p>
      </div>
      <div class="stat-card">
        <h3>Completed This Year</h3>
        <p class="value">{{ completedThisYear }}</p>
      </div>
    </div>
    
    <div class="quick-links">
      <NuxtLink to="/reading/list" class="link-card">All Books</NuxtLink>
      <NuxtLink to="/reading/stats" class="link-card">Statistics</NuxtLink>
      <NuxtLink to="/reading/goals" class="link-card">Goals</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  totalBooks: number
  readingCount: number
  completedThisYear: number
}>()
</script>

<style scoped>
.reading-dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.reading-dashboard h1 {
  display: none;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-card {
  background: var(--color-white, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  padding: 24px;
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 8px 0;
  font-size: 0.85rem;
  color: var(--color-muted, #666);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-card .value {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text, #111);
}

.quick-links {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.link-card {
  padding: 12px 20px;
  background: var(--color-text, #111);
  color: var(--color-white, #fff);
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: opacity 0.2s;
}

.link-card:hover {
  opacity: 0.85;
}

@media (max-width: 768px) {
  .stats-overview {
    grid-template-columns: 1fr;
  }
}
</style>
