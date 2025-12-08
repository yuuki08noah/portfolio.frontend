<template>
  <div class="blog-write">
    <h1>Write New Post</h1>
  </div>
</template>

<script setup lang="ts">
const { createPost } = useBlog()

definePageMeta({
  middleware: 'auth'
})
</script>
