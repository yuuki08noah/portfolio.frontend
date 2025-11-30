<template>
  <div class="blog-search">
    <input
      v-model="query"
      type="text"
      placeholder="Search posts..."
      @input="handleSearch"
    />
    
    <div v-if="results.length > 0" class="search-results">
      <PostCard v-for="post in results" :key="post.id" :post="post" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/types'

const query = ref('')
const results = ref<BlogPost[]>([])
const { searchPosts } = useBlog()

const handleSearch = async () => {
  if (query.value.length > 2) {
    const response = await searchPosts(query.value)
    results.value = response.data
  } else {
    results.value = []
  }
}
</script>
