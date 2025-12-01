<template>
  <div class="project-detail-page">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
    </div>
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <NuxtLink to="/projects" class="btn-back">Back to Projects</NuxtLink>
    </div>
    <template v-else-if="project">
      <div class="container">
        <!-- Notion-style Header -->
        <header class="project-header">
          <div class="header-icon">📂</div>
          <h1 class="project-title">{{ project.title }}</h1>
          <div class="project-meta">
            <span class="category-badge" v-if="project.category">{{ project.category }}</span>
            <span class="separator" v-if="project.category && project.startDate">•</span>
            <span class="date" v-if="project.startDate">{{ formatDate(project.startDate) }}</span>
            <div class="header-actions">
              <a v-if="project.links?.demo" :href="project.links.demo" target="_blank" class="action-link">
                Visit Website ↗
              </a>
              <a v-if="project.links?.repo" :href="project.links.repo" target="_blank" class="action-link">
                View Code ↗
              </a>
            </div>
          </div>
          <p class="project-description">{{ project.description }}</p>
        </header>

        <div class="layout">
          <!-- Main Content (Overview) -->
          <div class="main-column">
            <article class="project-content">
              <div class="markdown-body" v-html="renderedOverview"></div>
            </article>
          </div>

          <!-- Sidebar -->
          <aside class="sidebar-column">
            <div class="sticky-sidebar">
              <!-- Tech Stack -->
              <div class="sidebar-widget">
                <h3 class="widget-title">Technologies</h3>
                <div class="tech-tags">
                  <span v-for="tech in project.stack" :key="tech" class="tech-tag">
                    {{ tech }}
                  </span>
                </div>
              </div>

              <!-- Documentation -->
              <div v-if="nonOverviewDocs.length > 0" class="sidebar-widget">
                <h3 class="widget-title">Documentation</h3>
                <div class="docs-nav">
                  <div class="doc-filters">
                    <button 
                      v-for="cat in availableCategories" 
                      :key="cat.value"
                      :class="['filter-btn', { active: activeCategory === cat.value }]"
                      @click="activeCategory = cat.value"
                    >
                      {{ cat.label }}
                    </button>
                  </div>
                  
                  <div class="docs-links">
                    <NuxtLink
                      v-for="doc in filteredDocs"
                      :key="doc.id"
                      :to="`/projects/${slug}/docs/${doc.category}/${doc.slug}`"
                      class="doc-link-item"
                    >
                      <span class="doc-title-link">{{ doc.title }}</span>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { marked } from 'marked'
import type { PortfolioProject, ProjectBlogPost } from '~/types/portfolio'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { fetchProject, fetchProjectDocs } = useProjects()

const project = ref<PortfolioProject | null>(null)
const docs = ref<ProjectBlogPost[]>([])
const loading = ref(true)
const docsLoading = ref(true)
const error = ref<string | null>(null)
const activeCategory = ref('all')

const categories = [
  { value: 'all', label: 'All' },
  { value: 'technical', label: 'Technical' },
  { value: 'troubleshooting', label: 'Troubleshooting' },
  { value: 'devlog', label: 'Dev Log' },
  { value: 'reference', label: 'Reference' }
]

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  })
}

// Get overview doc content
const overviewDoc = computed(() => {
  return docs.value.find(d => d.category === 'overview')
})

const overviewContent = computed(() => {
  return overviewDoc.value?.content || ''
})

const renderedOverview = computed(() => {
  if (!overviewContent.value) return ''
  try {
    return marked(overviewContent.value)
  } catch (e) {
    return '<p>Error rendering content</p>'
  }
})

// Filter out overview from docs list
const nonOverviewDocs = computed(() => {
  return docs.value.filter(d => d.category !== 'overview')
})

const availableCategories = computed(() => {
  const cats = new Set(nonOverviewDocs.value.map(d => d.category))
  return [
    { value: 'all', label: 'All' },
    ...categories.filter(c => c.value !== 'all' && cats.has(c.value))
  ]
})

const filteredDocs = computed(() => {
  if (activeCategory.value === 'all') return nonOverviewDocs.value
  return nonOverviewDocs.value.filter(d => d.category === activeCategory.value)
})

const loadProject = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetchProject(slug.value)
    project.value = response.project
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to load project'
  } finally {
    loading.value = false
  }
}

const loadDocs = async () => {
  docsLoading.value = true
  try {
    const response = await fetchProjectDocs(slug.value)
    docs.value = response.docs || []
  } catch (e: any) {
    docs.value = []
  } finally {
    docsLoading.value = false
  }
}

onMounted(() => {
  loadProject()
  loadDocs()
})

watch(slug, () => {
  loadProject()
  loadDocs()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Inter:wght@400;500;600&display=swap');

.project-detail-page {
  min-height: 100vh;
  background-color: #fff;
  color: #111;
  padding: 60px 0 100px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Loading & Error */
.loading-state, .error-state {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #111;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Header */
.project-header {
  margin-bottom: 60px;
  padding-bottom: 40px;
  border-bottom: 1px solid #e5e5e5;
}

.header-icon {
  font-size: 3rem;
  margin-bottom: 24px;
}

.project-title {
  font-family: 'Playfair Display', serif;
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1.1;
  margin: 0 0 24px;
  letter-spacing: -1px;
}

.project-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 24px;
}

.category-badge {
  background: #f5f5f5;
  padding: 4px 12px;
  border-radius: 4px;
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #444;
}

.separator {
  color: #ccc;
}

.header-actions {
  display: flex;
  gap: 16px;
  margin-left: auto;
}

.action-link {
  color: #111;
  text-decoration: none;
  font-weight: 600;
  border-bottom: 1px solid #111;
  padding-bottom: 2px;
  transition: opacity 0.2s;
}

.action-link:hover {
  opacity: 0.7;
}

.project-description {
  font-family: 'Merriweather', serif;
  font-size: 1.25rem;
  line-height: 1.6;
  color: #444;
  max-width: 800px;
  margin: 0;
}

/* Layout */
.layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 80px;
}

/* Main Content */
.markdown-body {
  font-family: 'Merriweather', serif;
  font-size: 1.125rem;
  line-height: 1.9;
  color: #222;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  color: #111;
  margin-top: 48px;
  margin-bottom: 24px;
}

.markdown-body :deep(p) {
  margin-bottom: 32px;
}

.markdown-body :deep(img) {
  width: 100%;
  height: auto;
  margin: 40px 0;
  display: block;
  border-radius: 4px;
}

.markdown-body :deep(a) {
  color: #111;
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* Sidebar */
.sticky-sidebar {
  position: sticky;
  top: 40px;
}

.sidebar-widget {
  margin-bottom: 48px;
}

.widget-title {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #999;
  margin: 0 0 20px;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  padding: 6px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #444;
  font-family: 'Inter', sans-serif;
}

/* Doc Links */
.doc-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.filter-btn {
  background: none;
  border: none;
  font-size: 0.75rem;
  color: #999;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
  transition: all 0.2s;
}

.filter-btn:hover, .filter-btn.active {
  color: #111;
  background: #f5f5f5;
}

.docs-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.doc-link-item {
  display: block;
  padding: 8px 0;
  color: #444;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  border-bottom: 1px solid #eee;
  transition: all 0.2s;
}

.doc-link-item:hover {
  color: #111;
  padding-left: 4px;
  border-bottom-color: #111;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .project-title {
    font-size: 2.5rem;
  }
  
  .header-actions {
    margin-left: 0;
    width: 100%;
    margin-top: 16px;
  }
}
</style>
