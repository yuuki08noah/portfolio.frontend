<template>
  <div class="travel-stats">
    <div class="stat-card">
      <h3>Countries Visited</h3>
      <p class="value">{{ stats?.countriesVisited || 0 }}</p>
    </div>
    
    <div class="stat-card">
      <h3>Cities Visited</h3>
      <p class="value">{{ stats?.citiesVisited || 0 }}</p>
    </div>
    
    <div class="stat-card">
      <h3>Total Travel Days</h3>
      <p class="value">{{ stats?.totalDays || 0 }}</p>
    </div>
    
    <div class="stat-card">
      <h3>Total Expenses</h3>
      <p class="value">{{ stats?.totalExpenses || 0 }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  stats?: {
    countriesVisited: number
    citiesVisited: number
    totalDays: number
    totalExpenses: number
  }
}>()
</script>
