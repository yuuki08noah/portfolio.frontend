<template>
  <section v-if="firstDoc" class="project-doc-detail container">
    <div class="layout">
      <ProjectDocViewer :project-slug="slug" :doc="firstDoc" />
      <ProjectDocsSidebar :project-slug="slug" :docs="docs || []" />
    </div>
  </section>
  <p v-else class="empty container">No documents found for this project.</p>
</template>

<script setup lang="ts">
import ProjectDocViewer from '~/components/blog/ProjectDocViewer.vue'
import ProjectDocsSidebar from '~/components/blog/ProjectDocsSidebar.vue'

const route = useRoute()
const { fetchProjectDocs } = useProjects()

const slug = route.params.slug as string

const { data: docs } = await useAsyncData(`project-docs-${slug}`, () =>
  fetchProjectDocs(slug).then((res) => res.docs)
)

const firstDoc = computed(() => {
  if (!docs.value || docs.value.length === 0) return null
  
  // Priority: Overview -> First available
  const overview = docs.value.find(d => d.category === 'overview')
  return overview || docs.value[0]
})
</script>

<style scoped>
.project-doc-detail {
  padding: 60px 24px 100px;
  background: #fff;
  min-height: 100vh;
}

.layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 60px;
  max-width: 1200px;
  margin: 0 auto;
}

.empty {
  color: #666;
  text-align: center;
  padding: 100px 0;
  font-family: 'Inter', sans-serif;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
</style>
