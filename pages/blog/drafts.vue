<template>
  <div class="blog-drafts">
    <h1>Drafts</h1>
  </div>
</template>

<script setup lang="ts">
const { fetchPosts } = useBlog()

const { data: drafts } = await useAsyncData('drafts', () =>
  fetchPosts({ status: 'draft' }).then(res => res.data)
)

definePageMeta({
  middleware: 'auth',
  ssr: true
})
</script>
