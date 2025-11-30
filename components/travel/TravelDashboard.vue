<template>
  <div class="travel-dashboard">
    <h1>Travel Dashboard</h1>
    <div class="dashboard-sections">
      <NuxtLink to="/travel/diary" class="section-card">
        <h3>Travel Diaries</h3>
        <p>{{ diaryCount }} diaries</p>
      </NuxtLink>
      
      <NuxtLink to="/travel/plan" class="section-card">
        <h3>Travel Plans</h3>
        <p>{{ planCount }} plans</p>
      </NuxtLink>
      
      <NuxtLink to="/travel/map" class="section-card">
        <h3>Travel Map</h3>
      </NuxtLink>
      
      <NuxtLink to="/travel/stats" class="section-card">
        <h3>Statistics</h3>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  diaryCount: number
  planCount: number
}>()
</script>
