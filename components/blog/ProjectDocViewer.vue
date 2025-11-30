<template>
  <article class="project-doc-viewer">
    <header>
      <div class="breadcrumb">
        <NuxtLink to="/projects">Portfolio</NuxtLink>
        <span>/</span>
        <NuxtLink :to="`/projects/${projectSlug}`">{{ projectSlug }}</NuxtLink>
        <span>/</span>
        <span>{{ doc.category }}</span>
        <span>/</span>
        <span>{{ doc.title }}</span>
      </div>
      
      <h1>{{ doc.title }}</h1>
      
      <VelogLinkButton v-if="doc.velogUrl" :url="doc.velogUrl" />
    </header>
    
    <MarkdownRenderer :content="doc.content" />
    
    <footer>
      <VelogStatsCard v-if="doc.velogUrl" :doc-id="doc.id" />
    </footer>
  </article>
</template>

<script setup lang="ts">
import type { ProjectDocument } from '~/types'

defineProps<{
  projectSlug: string
  doc: ProjectDocument
}>()
</script>
