<template>
  <div class="project-detail-shell">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
    </div>
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <NuxtLink to="/projects" class="btn-back">Back to Projects</NuxtLink>
    </div>
    <template v-else-if="project">
      <div class="post-detail-container project-detail-container">
        <!-- Left Column -->
        <div class="content-column">
          <article class="post-detail">
            <div v-if="project.coverImage" class="cover-wrapper">
              <img :src="project.coverImage" :alt="project.title" class="cover" />
            </div>

            <header class="article-header">
              <div class="article-meta-top">
                <span class="category">Project</span>
                <span v-if="project.category" class="meta-pill">{{ project.category }}</span>
              </div>

              <h1 class="article-title">{{ project.title }}</h1>
              <p v-if="project.description" class="article-subtitle">{{ project.description }}</p>

              <div class="article-meta">
                <div class="meta-left">
                  <span v-if="project.startDate" class="date">Started {{ formatDate(project.startDate) }}</span>
                  <span v-if="project.endDate" class="date"> · Ended {{ formatDate(project.endDate) }}</span>
                  <span v-else-if="project.is_ongoing" class="date"> · Ongoing</span>
                </div>
                <div class="meta-right">
                  <a v-if="project.links?.demo" :href="project.links.demo" target="_blank" class="meta-action">Live Demo ↗</a>
                  <a v-if="project.links?.repo" :href="project.links.repo" target="_blank" class="meta-action">Source ↗</a>
                </div>
              </div>

              <div class="header-divider"></div>
            </header>

            <div class="article-content">
              <div class="markdown-body" v-html="renderedOverview"></div>
            </div>
          </article>
        </div>

        <!-- Right Column -->
        <aside class="comments-column docs-column">
          <div class="comments-sticky">
            <div class="sidebar-card">
              <h3 class="sidebar-title">Tech Stack</h3>
              <div class="stack-tags">
                <span v-for="tech in project.stack" :key="tech" class="stack-tag">{{ tech }}</span>
              </div>
            </div>

            <div v-if="nonOverviewDocs.length > 0" class="sidebar-card">
              <h3 class="sidebar-title">Documentation</h3>
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
              <div class="docs-list">
                <NuxtLink
                  v-for="doc in filteredDocs"
                  :key="doc.id"
                  :to="`/projects/${slug}/docs/${doc.category}/${doc.slug}`"
                  class="doc-card"
                >
                  <div class="doc-card-meta">
                    <span class="doc-category">{{ getCategoryLabel(doc.category) }}</span>
                    <span class="doc-arrow">→</span>
                  </div>
                  <div class="doc-card-title">{{ doc.title }}</div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </aside>
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
.project-detail-shell {
  min-height: 100vh;
  padding: 60px 0 100px;
  background: #fff;
  color: #111;
}

.post-detail-container {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 60px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
}

.content-column {
  overflow-y: auto;
  max-height: calc(100vh - 120px);
  padding-right: 20px;
}

.content-column::-webkit-scrollbar {
  width: 6px;
}
.content-column::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 3px;
}
.content-column::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}

.post-detail {
  max-width: 820px;
}

.comments-column {
  position: sticky;
  top: 80px;
  height: calc(100vh - 140px);
  overflow-y: auto;
  padding-left: 20px;
  border-left: 1px solid #e0e0e0;
}

.comments-column::-webkit-scrollbar {
  width: 6px;
}
.comments-column::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 3px;
}
.comments-column::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}

.comments-sticky {
  padding-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.cover-wrapper {
  margin: 0 0 40px;
}
.cover {
  width: 100%;
  max-height: 480px;
  object-fit: cover;
  border-radius: 8px;
}

.article-header {
  margin-bottom: 32px;
}

.article-meta-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.category {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #666;
  background: #f5f5f5;
  padding: 6px 12px;
  border-radius: 3px;
}

.meta-pill {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: #333;
  padding: 6px 12px;
  border-radius: 999px;
  background: #eef2ff;
}

.article-title {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0 0 16px;
}

.article-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  color: #444;
  margin: 0 0 20px;
  line-height: 1.6;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #666;
}

.meta-left .date + .date {
  margin-left: 4px;
}

.meta-right {
  display: flex;
  gap: 16px;
}

.meta-action {
  color: #111;
  font-weight: 700;
  text-decoration: none;
  border-bottom: 1px solid #111;
  padding-bottom: 2px;
  transition: opacity 0.2s ease;
}

.meta-action:hover {
  opacity: 0.7;
}

.header-divider {
  border-bottom: 1px solid #e5e5e5;
  margin-top: 24px;
}

.article-content .markdown-body {
  font-family: 'Inter', sans-serif;
  font-size: 1.05rem;
  line-height: 1.85;
  color: #222;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-weight: 800;
  color: #111;
  margin-top: 42px;
  margin-bottom: 20px;
}

.markdown-body :deep(p) {
  margin-bottom: 24px;
}

.markdown-body :deep(img) {
  width: 100%;
  height: auto;
  margin: 28px 0;
  border-radius: 6px;
}

.markdown-body :deep(a) {
  color: #111;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.sidebar-card {
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  padding: 18px 16px;
  background: #fafafa;
}

.sidebar-title {
  margin: 0 0 12px;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  color: #222;
  letter-spacing: 0.02em;
}

.stack-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.stack-tag {
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #333;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
}

.doc-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.filter-btn {
  background: #fff;
  border: 1px solid #e0e0e0;
  font-size: 0.8rem;
  color: #555;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  transition: all 0.2s;
}

.filter-btn:hover,
.filter-btn.active {
  color: #111;
  border-color: #111;
  background: #f5f5f5;
}

.docs-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.doc-card {
  display: block;
  padding: 12px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  text-decoration: none;
  background: #fff;
  transition: all 0.2s ease;
}

.doc-card:hover {
  border-color: #111;
  transform: translateX(3px);
}

.doc-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  color: #666;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
}

.doc-category {
  background: #eef2ff;
  color: #333;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 700;
}

.doc-card-title {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #111;
}

.doc-arrow {
  font-weight: 700;
}

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

.btn-back {
  color: #111;
  font-weight: 700;
  text-decoration: underline;
}

@media (max-width: 1100px) {
  .post-detail-container {
    grid-template-columns: 1fr;
    max-width: 960px;
  }

  .comments-column {
    position: static;
    height: auto;
    border-left: none;
    padding-left: 0;
    overflow: visible;
  }

  .content-column {
    max-height: none;
    padding-right: 0;
  }
}

@media (max-width: 720px) {
  .article-title {
    font-size: 2.3rem;
  }
  .article-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>
