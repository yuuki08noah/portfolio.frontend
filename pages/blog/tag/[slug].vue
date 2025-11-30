<template>
  <section class="tag-page container">
    <header class="page-header">
      <h1>#{{ slug }}</h1>
    </header>

    <PostList :posts="posts || []" />
  </section>
</template>

<script setup lang="ts">
import PostList from '~/components/blog/PostList.vue'

const route = useRoute()
const { fetchPosts } = useBlog()

const slug = route.params.slug as string
const { data: posts } = await useAsyncData(`tag-${slug}`, () =>
  fetchPosts({ tag: slug }).then((res) => res.data)
)
</script>

<style scoped>
.tag-page {
  padding: var(--spacing-3xl) var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.page-header {
  text-align: center;
}
</style>
