<template>
  <section class="project-docs container" v-if="docs">
    <header class="page-header">
      <p class="eyebrow">Project Docs</p>
      <h1>{{ slug }}</h1>
      <p class="subtitle">Category: {{ category }}</p>
    </header>

    <div class="layout">
      <ProjectDocsSidebar :project-slug="slug" :docs="allDocs || []" />
      <div class="card doc-list">
        <h2>{{ categoryLabel }}</h2>
        <div class="grid grid-2">
          <DocumentListItem v-for="doc in docs" :key="doc.id" :doc="doc" />
        </div>
      </div>
    </div>
  </section>
  <p v-else class="empty container">No documents in this category.</p>
</template>

<script setup lang="ts">
import DocumentListItem from '~/components/blog/DocumentListItem.vue'
import ProjectDocsSidebar from '~/components/blog/ProjectDocsSidebar.vue'

const route = useRoute()
const { fetchProjectDocs } = useProjectBlog()

const slug = route.params.slug as string
const category = route.params.category as string

const { data: docs } = await useAsyncData(
  `project-${slug}-${category}`,
  () => fetchProjectDocs(slug, category).then((res) => res.data)
)
const { data: allDocs } = await useAsyncData(`project-${slug}-all`, () =>
  fetchProjectDocs(slug).then((res) => res.data)
)

const categoryLabel = computed(
  () => category.charAt(0).toUpperCase() + category.slice(1)
)
</script>

<style scoped>
.project-docs {
  padding: var(--spacing-3xl) var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.page-header {
  text-align: center;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.85rem;
  color: var(--color-accent);
  margin-bottom: var(--spacing-xs);
  font-weight: 700;
}

.layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--spacing-lg);
}

.doc-list {
  padding: var(--spacing-xl);
}

.empty {
  color: var(--color-gray-600);
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
