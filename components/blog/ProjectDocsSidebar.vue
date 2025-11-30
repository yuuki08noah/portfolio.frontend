<template>
  <aside class="project-docs-sidebar">
    <div class="sidebar-header">
      <h3>Contents</h3>
    </div>
    <nav class="sidebar-nav">
      <div v-for="category in groupedDocs" :key="category.name" class="category-group">
        <h4 class="category-title">{{ category.name }}</h4>
        <ul class="doc-list">
          <li v-for="doc in category.docs" :key="doc.id">
            <NuxtLink 
              :to="`/blog/projects/${projectSlug}/${doc.category}/${doc.slug}`"
              class="doc-link"
              active-class="active"
            >
              <span class="doc-title">{{ doc.title }}</span>
              <span class="active-indicator"></span>
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

<style scoped>
.project-docs-sidebar {
  padding-right: 24px;
  border-right: 1px solid #e5e5e5;
}

.sidebar-header {
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 4px solid #111;
}

.sidebar-header h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  font-style: italic;
}

.category-group {
  margin-bottom: 32px;
}

.category-title {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #999;
  margin: 0 0 16px;
}

.doc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.doc-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  color: #444;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  transition: all 0.2s;
  border-bottom: 1px solid transparent;
}

.doc-link:hover {
  color: #111;
}

.doc-link.active {
  color: #111;
  font-weight: 600;
}

.active-indicator {
  width: 6px;
  height: 6px;
  background: #111;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s;
}

.doc-link.active .active-indicator {
  opacity: 1;
}

@media (max-width: 960px) {
  .project-docs-sidebar {
    border-right: none;
    border-bottom: 1px solid #e5e5e5;
    padding-right: 0;
    padding-bottom: 32px;
    margin-bottom: 32px;
  }
}
</style>
