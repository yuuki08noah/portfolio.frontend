<template>
  <section v-if="doc" class="project-doc-detail container">
    <div class="layout">
      <ProjectDocsSidebar :project-slug="slug" :docs="allDocs || []" />
      <ProjectDocViewer :project-slug="slug" :doc="doc" />
    </div>
  </section>
  <p v-else class="empty container">Document not found.</p>
</template>

<script setup lang="ts">
import ProjectDocViewer from '~/components/blog/ProjectDocViewer.vue'
import ProjectDocsSidebar from '~/components/blog/ProjectDocsSidebar.vue'

const route = useRoute()
const { fetchProjectDoc, fetchProjectDocs } = useProjectBlog()

const slug = route.params.slug as string
const category = route.params.category as string
const docSlug = route.params.docSlug as string

const { data: doc } = await useAsyncData(
  `project-doc-${slug}-${category}-${docSlug}`,
  () => fetchProjectDoc(slug, category, docSlug).then((res) => res.data)
)
const { data: allDocs } = await useAsyncData(`project-${slug}-all-docs`, () =>
  fetchProjectDocs(slug).then((res) => res.data)
)
</script>

<style scoped>
.project-doc-detail {
  padding: var(--spacing-3xl) var(--spacing-md);
}

.layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--spacing-lg);
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
