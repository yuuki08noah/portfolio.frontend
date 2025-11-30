<template>
  <NuxtLink :to="docUrl" class="document-list-item">
    <div class="doc-info">
      <h4>{{ doc.title }}</h4>
      <span class="category-badge">{{ doc.category }}</span>
    </div>
    
    <div v-if="doc.velogUrl" class="velog-badge">
      <span class="icon">V</span>
      <VelogStatsCard :doc-id="doc.id" :compact="true" />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { ProjectDocument } from '~/types'

const props = defineProps<{
  doc: ProjectDocument
}>()

const docUrl = computed(() => {
  return `/blog/projects/${props.doc.projectId}/${props.doc.category}/${props.doc.slug}`
})
</script>
