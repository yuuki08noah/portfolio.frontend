<template>
  <ClientOnly>
    <div class="markdown-content" v-html="renderedMarkdown"></div>
    <template #fallback>
      <div class="markdown-content markdown-loading">Loading...</div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  content: string
}>()

const { renderMarkdown } = useMarkdown()

const renderedMarkdown = computed(() => renderMarkdown(props.content))
</script>

<style>
.markdown-content {
  line-height: 1.75;
  color: #374151;
}

/* Headings */
.markdown-content h1 {
  font-size: 2.25em;
  font-weight: 700;
  margin: 1.5em 0 0.5em;
  color: #111827;
  line-height: 1.2;
}

.markdown-content h2 {
  font-size: 1.75em;
  font-weight: 700;
  margin: 1.25em 0 0.5em;
  color: #111827;
  line-height: 1.3;
}

.markdown-content h3 {
  font-size: 1.375em;
  font-weight: 600;
  margin: 1em 0 0.5em;
  color: #111827;
}

.markdown-content h4 {
  font-size: 1.125em;
  font-weight: 600;
  margin: 1em 0 0.5em;
  color: #374151;
}

.markdown-content h5,
.markdown-content h6 {
  font-size: 1em;
  font-weight: 600;
  margin: 1em 0 0.5em;
  color: #4b5563;
}

/* Paragraphs */
.markdown-content p {
  margin: 1em 0;
}

/* Links */
.markdown-content a {
  color: #2563eb;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

.markdown-content a:hover {
  border-bottom-color: #2563eb;
}

/* Code */
.markdown-content code {
  background: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: #e11d48;
}

.markdown-content pre {
  background: #1f2937;
  color: #e5e7eb;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.5em 0;
}

.markdown-content pre code {
  background: transparent;
  color: inherit;
  padding: 0;
  font-size: 0.875em;
}

/* Lists */
.markdown-content ul,
.markdown-content ol {
  margin: 1em 0;
  padding-left: 1.5em;
}

.markdown-content li {
  margin: 0.5em 0;
}

.markdown-content ul {
  list-style-type: disc;
}

.markdown-content ol {
  list-style-type: decimal;
}

/* Task lists */
.markdown-content .task-list {
  list-style: none;
  padding-left: 0;
}

.markdown-content .task-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.markdown-content .task-list input[type="checkbox"] {
  margin-top: 4px;
}

.markdown-content .task-done {
  color: #9ca3af;
  text-decoration: line-through;
}

/* Blockquotes */
.markdown-content blockquote {
  border-left: 4px solid #d1d5db;
  padding-left: 16px;
  margin: 1.5em 0;
  color: #4b5563;
  font-style: italic;
}

/* Tables */
.markdown-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5em 0;
}

.markdown-content th,
.markdown-content td {
  border: 1px solid #e5e7eb;
  padding: 10px 14px;
  text-align: left;
}

.markdown-content th {
  background: #f9fafb;
  font-weight: 600;
}

.markdown-content tr:nth-child(even) {
  background: #f9fafb;
}

/* Horizontal rule */
.markdown-content hr {
  border: none;
  border-top: 2px solid #e5e7eb;
  margin: 2em 0;
}

/* Images */
.markdown-content img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1.5em 0;
}

/* Multi-column layouts */
.markdown-content .layout-row {
  display: flex;
  gap: 24px;
  margin: 24px 0;
  align-items: flex-start;
}

.markdown-content .layout-col {
  flex: 1;
  min-width: 0;
}

/* Backward compatibility for old grid-2 */
.markdown-content .layout-grid-2 {
  display: flex;
  gap: 24px;
  margin: 24px 0;
}

.markdown-content .layout-grid-2 > div {
  flex: 1;
  min-width: 0;
}

/* Callout blocks */
.markdown-content .callout {
  background: #f0f7ff;
  border-left: 4px solid #2196f3;
  padding: 16px;
  margin: 20px 0;
  border-radius: 4px;
  display: flex;
  gap: 12px;
}

.markdown-content .callout-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.markdown-content .callout-content {
  flex: 1;
}

/* Embeds */
.markdown-content iframe {
  max-width: 100%;
  border-radius: 8px;
  margin: 1.5em 0;
}

/* Strong and emphasis */
.markdown-content strong {
  font-weight: 600;
  color: #111827;
}

.markdown-content em {
  font-style: italic;
}

.markdown-content del {
  text-decoration: line-through;
  color: #9ca3af;
}
</style>
