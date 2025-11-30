<template>
  <div class="doc-page">
    <div v-if="loading" class="loading">Loading document...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <template v-else-if="doc">
      <div class="container">
        <nav class="breadcrumb">
          <NuxtLink to="/projects">Projects</NuxtLink>
          <span>/</span>
          <NuxtLink :to="`/projects/${projectSlug}`">{{ projectSlug }}</NuxtLink>
          <span>/</span>
          <span class="current">{{ doc.title }}</span>
        </nav>

        <article class="doc-content">
          <header class="doc-header">
            <span class="doc-category">{{ getCategoryLabel(doc.category) }}</span>
            <h1 class="doc-title">{{ doc.title }}</h1>
            <div class="doc-meta">
              <span v-if="doc.created_at">{{ formatDate(doc.created_at) }}</span>
              <a
                v-if="doc.velog_url"
                :href="doc.velog_url"
                target="_blank"
                rel="noopener"
                class="velog-link"
              >
                View on Velog →
              </a>
            </div>
            <div v-if="doc.velog_stats" class="velog-stats">
              <span>❤️ {{ doc.velog_stats.likes }} Likes</span>
              <span>💬 {{ doc.velog_stats.comments }} Comments</span>
              <span>👁 {{ doc.velog_stats.views }} Views</span>
            </div>
          </header>

          <div class="markdown-body" v-html="renderedContent"></div>
        </article>

        <footer class="doc-footer">
          <NuxtLink :to="`/projects/${projectSlug}`" class="back-btn">
            ← Back to Project
          </NuxtLink>
        </footer>
      </div>
    </template>
    <div v-else class="empty">No document found</div>
  </div>
</template>

<script setup lang="ts">
import type { ProjectBlogPost } from '~/types/portfolio'

const route = useRoute()
const projectSlug = computed(() => route.params.slug as string)
const category = computed(() => route.params.category as string)
const docSlug = computed(() => route.params.docSlug as string)

const { fetchProjectDoc } = useProjects()
const { renderMarkdown } = useMarkdown()

const categories = [
  { value: 'overview', label: 'Overview' },
  { value: 'technical', label: 'Technical' },
  { value: 'troubleshooting', label: 'Troubleshooting' },
  { value: 'devlog', label: 'Dev Log' },
  { value: 'reference', label: 'Reference' }
]

const getCategoryLabel = (cat: string) => {
  return categories.find(c => c.value === cat)?.label || cat
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const { data: doc, pending: loading, error } = await useAsyncData(
  `project-doc-${projectSlug.value}-${category.value}-${docSlug.value}`,
  async () => {
    const response = await fetchProjectDoc(projectSlug.value, category.value, docSlug.value)
    return response.doc
  }
)

const renderedContent = computed(() => {
  if (!doc.value?.content) return ''
  return renderMarkdown(doc.value.content)
})
</script>

<style scoped>
.doc-page {
  min-height: 100vh;
  padding: var(--spacing-2xl) 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.loading, .error {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-muted);
  font-size: var(--text-lg);
}

.error {
  color: #dc3545;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  font-size: var(--text-sm);
  color: var(--color-muted);
}

.breadcrumb a {
  color: var(--color-muted);
  text-decoration: none;
}

.breadcrumb a:hover {
  color: var(--color-text);
}

.breadcrumb .current {
  color: var(--color-text);
  font-weight: 600;
}

.doc-content {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-2xl);
}

.doc-header {
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.doc-category {
  display: inline-block;
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  padding: 4px 12px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-md);
}

.doc-title {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 900;
  margin: 0 0 var(--spacing-md);
  line-height: 1.2;
}

.doc-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  font-size: var(--text-sm);
  color: var(--color-muted);
}

.velog-link {
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 600;
}

.velog-link:hover {
  text-decoration: underline;
}

.velog-stats {
  display: flex;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-md);
  font-size: var(--text-sm);
  color: var(--color-muted);
}

.markdown-body {
  line-height: 1.8;
  font-size: var(--text-base);
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  font-family: var(--font-heading);
  font-weight: 800;
  margin-top: var(--spacing-xl);
  margin-bottom: var(--spacing-md);
}

.markdown-body :deep(h1) {
  font-size: var(--text-2xl);
}

.markdown-body :deep(h2) {
  font-size: var(--text-xl);
}

.markdown-body :deep(h3) {
  font-size: var(--text-lg);
}

.markdown-body :deep(p) {
  margin-bottom: var(--spacing-md);
}

.markdown-body :deep(code) {
  background: var(--color-bg);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-size: 0.9em;
}

.markdown-body :deep(pre) {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin: var(--spacing-lg) 0;
}

.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin-bottom: var(--spacing-md);
  padding-left: var(--spacing-xl);
}

.markdown-body :deep(li) {
  margin-bottom: var(--spacing-xs);
}

.markdown-body :deep(blockquote) {
  border-left: 4px solid var(--color-accent);
  padding-left: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
  color: var(--color-muted);
  font-style: italic;
}

.markdown-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-sm);
}

.doc-footer {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
}

.back-btn {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.back-btn:hover {
  background: var(--color-text);
  color: var(--color-white);
}

@media (max-width: 768px) {
  .doc-title {
    font-size: 1.75rem;
  }

  .doc-content {
    padding: var(--spacing-lg);
  }
}
</style>
