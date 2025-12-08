<template>
  <div class="project-detail-page">
    <div v-if="loading" class="loading">Loading project...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <template v-else-if="project">
      <!-- Project Header -->
      <section class="project-header">
        <div class="container">
          <NuxtLink to="/projects" class="back-link">← Back to Projects</NuxtLink>
          <h1 class="project-title">{{ project.title }}</h1>
          <p class="project-description">{{ project.description }}</p>
          
          <div class="project-meta">
            <div class="tech-stack">
              <span v-for="tech in project.stack" :key="tech" class="tech-chip">
                {{ tech }}
              </span>
            </div>
            <div class="project-links">
              <a
                v-if="project.links?.demo"
                :href="project.links.demo"
                target="_blank"
                rel="noopener"
                class="project-link"
              >
                Live Demo →
              </a>
              <a
                v-if="project.links?.repo"
                :href="project.links.repo"
                target="_blank"
                rel="noopener"
                class="project-link"
              >
                Repository →
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Project Overview -->
      <section v-if="overviewDoc" class="project-overview">
        <div class="container">
          <MarkdownRenderer :content="overviewDoc.content" />
        </div>
      </section>

      <!-- Project Features -->
      <section v-if="project.itinerary?.length" class="project-features">
        <div class="container">
          <h2 class="section-title">Key Features</h2>
          <ul class="feature-list">
            <li v-for="(feature, idx) in project.itinerary" :key="idx" class="feature-item">
              {{ feature }}
            </li>
          </ul>
        </div>
      </section>

      <!-- Project Documentation -->
      <section class="project-docs">
        <div class="container">
          <h2 class="section-title">Documentation</h2>
          
          <!-- Category Tabs -->
          <div class="doc-tabs">
            <button
              v-for="cat in categories"
              :key="cat.value"
              :class="['tab-btn', { active: activeCategory === cat.value }]"
              @click="activeCategory = cat.value"
            >
              {{ cat.label }}
            </button>
          </div>

          <!-- Docs List -->
          <div v-if="docsLoading" class="loading-small">Loading documents...</div>
          <div v-else-if="filteredDocs.length === 0" class="empty-docs">
            No documents in this category yet.
          </div>
          <div v-else class="docs-list">
            <NuxtLink
              v-for="doc in filteredDocs"
              :key="doc.id"
              :to="`/projects/${slug}/docs/${doc.category}/${doc.slug}`"
              class="doc-card"
            >
              <h3 class="doc-title">{{ doc.title }}</h3>
              <p class="doc-category">{{ getCategoryLabel(doc.category) }}</p>
              <div v-if="doc.velogStats" class="velog-stats">
                <span>❤️ {{ doc.velogStats.likes }}</span>
                <span>💬 {{ doc.velogStats.comments }}</span>
                <span>👁 {{ doc.velogStats.views }}</span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Screenshots -->
      <section v-if="project.souvenirs?.length" class="project-screenshots">
        <div class="container">
          <h2 class="section-title">Screenshots</h2>
          <div class="screenshot-grid">
            <div v-for="(img, idx) in project.souvenirs" :key="idx" class="screenshot-item">
              <img :src="img" :alt="`Screenshot ${idx + 1}`" />
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { PortfolioProject, ProjectBlogPost } from '~/types/portfolio'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

import MarkdownRenderer from '~/components/blog/MarkdownRenderer.vue'

const { fetchProject, fetchProjectDocs } = useProjects()
// const { renderMarkdown } = useMarkdown() - Removed as it is handled by MarkdownRenderer

const project = ref<PortfolioProject | null>(null)
const docs = ref<ProjectBlogPost[]>([])
const loading = ref(true)
const docsLoading = ref(true)
const error = ref<string | null>(null)
const activeCategory = ref('all')

const categories = [
  { value: 'all', label: 'All' },
  { value: 'overview', label: 'Overview' },
  { value: 'technical', label: 'Technical' },
  { value: 'troubleshooting', label: 'Troubleshooting' },
  { value: 'devlog', label: 'Dev Log' },
  { value: 'references', label: 'References' }
]

const filteredDocs = computed(() => {
  if (activeCategory.value === 'all') return docs.value
  return docs.value.filter(d => d.category === activeCategory.value)
})

const getCategoryLabel = (cat: string) => {
  return categories.find(c => c.value === cat)?.label || cat
}

const overviewDoc = computed(() => {
  if (!docs.value.length) return null
  return docs.value.find(d => d.category === 'overview') || docs.value[0]
})

// renderedOverview computation removed as MarkdownRenderer handles content directly

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
.project-detail-page {
  min-height: 100vh;
}

.container {
  max-width: var(--max-width, 1200px);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.loading, .error {
  text-align: center;
  padding: var(--spacing-3xl);
  font-size: var(--text-lg);
  color: var(--color-muted);
}

.error {
  color: #dc3545;
}

.project-header {
  padding: var(--spacing-3xl) 0 var(--spacing-2xl);
  border-bottom: 2px solid var(--color-text);
}

.back-link {
  display: inline-block;
  margin-bottom: var(--spacing-lg);
  font-size: var(--text-sm);
  color: var(--color-muted);
  text-decoration: none;
  font-weight: 600;
}

.back-link:hover {
  color: var(--color-text);
}

.project-title {
  font-family: var(--font-heading);
  font-size: 3rem;
  font-weight: 900;
  margin: 0 0 var(--spacing-md);
}

.project-description {
  font-size: var(--text-lg);
  color: var(--color-muted);
  line-height: 1.6;
  margin: 0 0 var(--spacing-xl);
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.tech-chip {
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  padding: 4px 12px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}

.project-links {
  display: flex;
  gap: var(--spacing-md);
}

.project-link {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-text);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.project-link:hover {
  color: var(--color-accent);
}

.project-features,
.project-docs,
.project-screenshots {
  padding: var(--spacing-2xl) 0;
  border-bottom: 1px solid var(--color-border);
}

.section-title {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: 800;
  margin: 0 0 var(--spacing-lg);
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-md);
}

.feature-item {
  padding: var(--spacing-md);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}

.feature-item::before {
  content: '✓';
  margin-right: var(--spacing-sm);
  font-weight: bold;
}

.doc-tabs {
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-md);
}

.tab-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  background: none;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tab-btn:hover {
  background: var(--color-bg);
}

.tab-btn.active {
  background: var(--color-text);
  color: var(--color-white);
}

.loading-small {
  padding: var(--spacing-lg);
  color: var(--color-muted);
}

.empty-docs {
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--color-muted);
  background: var(--color-bg);
  border-radius: var(--radius-md);
}

.docs-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
}

.doc-card {
  display: block;
  padding: var(--spacing-lg);
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: inherit;
  transition: all var(--transition-fast);
}

.doc-card:hover {
  border-color: var(--color-text);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.doc-title {
  font-size: var(--text-lg);
  font-weight: 700;
  margin: 0 0 var(--spacing-xs);
}

.doc-category {
  font-size: var(--text-xs);
  color: var(--color-muted);
  text-transform: uppercase;
  margin: 0 0 var(--spacing-sm);
}

.velog-stats {
  display: flex;
  gap: var(--spacing-md);
  font-size: var(--text-xs);
  color: var(--color-muted);
}

.screenshot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.screenshot-item {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.screenshot-item img {
  width: 100%;
  height: auto;
  display: block;
}

@media (max-width: 768px) {
  .project-title {
    font-size: 2rem;
  }

  .project-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}

.project-overview {
  padding: var(--spacing-2xl) 0;
  border-bottom: 1px solid var(--color-border);
}
</style>
