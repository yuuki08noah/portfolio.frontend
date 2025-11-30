<template>
  <aside class="project-docs-sidebar">
    <nav>
      <div v-for="category in groupedDocs" :key="category.name" class="category-group">
        <h4>{{ category.name }}</h4>
        <ul>
          <li v-for="doc in category.docs" :key="doc.id">
            <NuxtLink :to="`/blog/projects/${projectSlug}/${doc.category}/${doc.slug}`">
              {{ doc.title }}
              <VelogStatsCard v-if="doc.velogUrl" :doc-id="doc.id" :compact="true" />
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import type { ProjectDocument } from '~/types'

const props = defineProps<{
  projectSlug: string
  docs: ProjectDocument[]
}>()

const groupedDocs = computed(() => {
  const categories = ['overview', 'troubleshooting', 'technical', 'devlog', 'references']
  
  return categories.map(cat => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    docs: props.docs.filter(doc => doc.category === cat)
  })).filter(group => group.docs.length > 0)
})
</script>
