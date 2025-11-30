<template>
  <div class="reading-stats">
    <h2>Reading Statistics</h2>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Books Read This Year</h3>
        <p class="value">{{ stats?.booksThisYear || 0 }}</p>
      </div>
      
      <div class="stat-card">
        <h3>Total Books Read</h3>
        <p class="value">{{ stats?.totalBooks || 0 }}</p>
      </div>
      
      <div class="stat-card">
        <h3>Average Rating</h3>
        <p class="value">{{ stats?.averageRating?.toFixed(1) || 0 }}/5</p>
      </div>
      
      <div class="stat-card">
        <h3>Favorite Author</h3>
        <p class="value">{{ stats?.favoriteAuthor || '-' }}</p>
      </div>
    </div>
    
    <div v-if="stats?.categoryDistribution" class="category-chart">
      <h3>Category Distribution</h3>
    </div>
    
    <div v-if="stats?.monthlyReading" class="monthly-chart">
      <h3>Monthly Reading</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  stats?: {
    booksThisYear: number
    totalBooks: number
    averageRating: number
    favoriteAuthor: string
    categoryDistribution?: Record<string, number>
    monthlyReading?: Record<string, number>
  }
}>()
</script>
