<template>
  <div class="blog-stats">
    <div class="stat-card">
      <h3>Total Posts</h3>
      <p class="value">{{ stats?.totalPosts || 0 }}</p>
    </div>
    
    <div class="stat-card">
      <h3>Total Views</h3>
      <p class="value">{{ stats?.totalViews || 0 }}</p>
    </div>
    
    <div class="stat-card">
      <h3>Categories</h3>
      <p class="value">{{ stats?.totalCategories || 0 }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  stats?: {
    totalPosts: number
    totalViews: number
    totalCategories: number
  }
}>()
</script>
