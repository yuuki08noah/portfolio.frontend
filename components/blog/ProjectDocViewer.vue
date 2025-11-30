<template>
  <article class="project-doc-viewer">
    <header class="viewer-header">
      <nav class="breadcrumb">
        <NuxtLink to="/projects">Portfolio</NuxtLink>
        <span class="separator">/</span>
        <NuxtLink :to="`/projects/${projectSlug}`">{{ projectSlug }}</NuxtLink>
        <span class="separator">/</span>
        <span class="current">{{ doc.category }}</span>
      </nav>
      
      <h1 class="doc-title">{{ doc.title }}</h1>
      
      <div class="header-meta">
        <span class="date" v-if="doc.createdAt">{{ formatDate(doc.createdAt) }}</span>
        <VelogLinkButton v-if="doc.velogUrl" :url="doc.velogUrl" class="velog-btn" />
      </div>
      
      <div class="header-divider"></div>
    </header>
    
    <div class="markdown-content">
      <MarkdownRenderer :content="doc.content" />
    </div>
    
    <footer class="viewer-footer">
      <div class="footer-divider"></div>
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

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).toUpperCase()
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Inter:wght@400;500;600&display=swap');

.project-doc-viewer {
  background: #fff;
  color: #111;
  max-width: 800px;
  margin: 0 auto;
}

/* Header */
.viewer-header {
  margin-bottom: 40px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #999;
}

.breadcrumb a {
  color: #999;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb a:hover {
  color: #111;
}

.breadcrumb .current {
  color: #111;
  font-weight: 600;
}

.separator {
  color: #ccc;
}

.doc-title {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 900;
  line-height: 1.1;
  margin: 0 0 24px;
  letter-spacing: -0.5px;
}

.header-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.date {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #666;
}

.header-divider {
  height: 4px;
  background: #111;
  width: 60px;
}

/* Content */
.markdown-content {
  font-family: 'Merriweather', serif;
  font-size: 1.125rem;
  line-height: 1.9;
  color: #222;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3) {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  color: #111;
  margin-top: 48px;
  margin-bottom: 24px;
}

.markdown-content :deep(p) {
  margin-bottom: 32px;
}

.markdown-content :deep(a) {
  color: #111;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.markdown-content :deep(blockquote) {
  border-left: 2px solid #111;
  padding-left: 24px;
  margin: 40px 0;
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  font-style: italic;
  color: #444;
}

.markdown-content :deep(img) {
  width: 100%;
  height: auto;
  margin: 40px 0;
  display: block;
}

/* Footer */
.viewer-footer {
  margin-top: 80px;
}

.footer-divider {
  text-align: center;
  margin-bottom: 40px;
}

.footer-divider::after {
  content: '• • •';
  font-size: 1.5rem;
  color: #ccc;
  letter-spacing: 12px;
}
</style>
