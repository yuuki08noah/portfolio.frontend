<template>
  <div class="post-list">
    <BlogPostCard v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/types'

defineProps<{
  posts: BlogPost[]
}>()
</script>

<style scoped>
.post-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 32px;
}

@media (max-width: 768px) {
  .post-list {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
</style>
