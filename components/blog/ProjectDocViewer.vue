<template>
  <article class="project-doc-viewer">
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
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Inter:wght@400;500;600&display=swap');

.project-doc-viewer {
  background: #fff;
  color: #111;
  max-width: 100%; /* Allow full width of grid column */
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
