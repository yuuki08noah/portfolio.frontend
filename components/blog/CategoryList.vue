<template>
  <div class="category-list">
    <NuxtLink
      v-for="category in categories"
      :key="category.id"
      :to="`/blog/category/${category.slug}`"
      class="category-item"
    >
      <span class="name">{{ category.name }}</span>
      <span class="count">{{ category.postCount }}</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/types'

defineProps<{
  categories: Category[]
}>()
</script>
