<template>
  <div class="post-list">
    <PostCard v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/types'
import PostCard from '~/components/blog/PostCard.vue'

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
