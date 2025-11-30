<template>
  <div class="project-blog-home">
    <h2>{{ projectSlug }} Documentation</h2>
    
    <div class="doc-categories">
      <div v-for="category in categories" :key="category" class="category-section">
        <h3>{{ formatCategory(category) }}</h3>
        <DocumentListItem
          v-for="doc in getDocsByCategory(category)"
          :key="doc.id"
          :doc="doc"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProjectDocument } from '~/types'

const props = defineProps<{
  projectSlug: string
  docs: ProjectDocument[]
}>()

const categories = ['overview', 'troubleshooting', 'technical', 'devlog', 'references'] as const

const getDocsByCategory = (category: string) => {
  return props.docs.filter(doc => doc.category === category)
}

const formatCategory = (category: string) => {
  return category.charAt(0).toUpperCase() + category.slice(1)
}
</script>
