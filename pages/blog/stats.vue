<template>
  <section class="blog-stats-page container">
    <header class="page-header">
      <h1>📊 Blog Statistics</h1>
      <p class="subtitle">Posts, views, and categories across the voyage logs.</p>
    </header>

    <BlogStats :stats="stats" />
  </section>
</template>

<script setup lang="ts">
import BlogStats from '~/components/blog/BlogStats.vue'

definePageMeta({
  middleware: 'auth',
  ssr: true
})

const { fetchPosts, fetchCategories } = useBlog()

const { data: posts } = await useAsyncData('blog-stats-posts', () =>
  fetchPosts().then((res) => res.data)
)
const { data: categories } = await useAsyncData('blog-stats-categories', () =>
  fetchCategories().then((res) => res.data)
)

const stats = computed(() => ({
  totalPosts: posts.value?.length || 0,
  totalViews: (posts.value || []).reduce((sum, post) => sum + (post.views || 0), 0),
  totalCategories: categories.value?.length || 0
}))
</script>

<style scoped>
.blog-stats-page {
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
