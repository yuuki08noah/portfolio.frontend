<template>
  <div class="blog-edit">
    <h1>Edit Post</h1>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { updatePost } = useBlog()

definePageMeta({
  middleware: 'auth',
  ssr: true
})
</script>
