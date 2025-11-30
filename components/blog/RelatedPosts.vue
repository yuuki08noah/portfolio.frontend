<template>
  <div class="related-posts">
    <div class="related-header">
      <div class="header-line"></div>
      <h3>More to Read</h3>
      <div class="header-line"></div>
    </div>
    <div class="posts-grid">
      <BlogPostCard v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/types'

defineProps<{
  posts: BlogPost[]
}>()
</script>

<style scoped>
.related-posts {
  max-width: 1000px;
  margin: 80px auto 0;
  padding: 0 24px;
}

.related-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 40px;
}

.related-header h3 {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111;
  white-space: nowrap;
}

.header-line {
  flex: 1;
  height: 1px;
  background: #e0e0e0;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

@media (max-width: 768px) {
  .related-posts {
    padding: 0 16px;
    margin-top: 60px;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
