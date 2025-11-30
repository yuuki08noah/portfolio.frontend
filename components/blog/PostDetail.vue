<template>
  <article class="post-detail">
    <!-- Cover Image -->
    <div v-if="post.cover_image" class="cover-wrapper">
      <img :src="post.cover_image" :alt="post.title" class="cover" />
    </div>
    
    <!-- Article Header -->
    <header class="article-header">
      <div class="article-meta-top">
        <span v-if="post.category" class="category">{{ post.category }}</span>
      </div>
      
      <h1 class="article-title">{{ post.title }}</h1>
      
      <p v-if="post.subtitle" class="article-subtitle">{{ post.subtitle }}</p>
      
      <div class="article-meta">
        <div class="meta-left">
          <span class="date">{{ formatDate(post.published_at || post.created_at) }}</span>
          <span class="separator">·</span>
          <span class="reading-time">{{ readingTime }} min read</span>
        </div>
        <div class="meta-right">
          <span class="views">{{ post.views || 0 }} views</span>
        </div>
      </div>
      
      <div class="header-divider"></div>
    </header>
    
    <!-- Article Content -->
    <div class="article-content">
      <MarkdownRenderer :content="post.content" />
    </div>
    
    <!-- Article Footer -->
    <footer class="article-footer">
      <div class="footer-divider"></div>
      
      <div class="tags-section" v-if="post.tags?.length">
        <span class="tags-label">Tags</span>
        <div class="tags">
          <NuxtLink
            v-for="tag in post.tags"
            :key="tag"
            :to="`/blog/tag/${tag}`"
            class="tag"
          >
            {{ tag }}
          </NuxtLink>
        </div>
      </div>
      
      <div class="share-section">
        <span class="share-label">Share this article</span>
        <ShareButtons :title="post.title" :url="currentUrl" />
      </div>
    </footer>
  </article>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/types'

const props = defineProps<{
  post: BlogPost
}>()

const { calculateReadingTime } = useMarkdown()
const route = useRoute()

const readingTime = computed(() => calculateReadingTime(props.post.content))
const currentUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${route.fullPath}`
  }
  return ''
})

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.post-detail {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Cover Image */
.cover-wrapper {
  margin: 0 -24px 48px;
  max-width: calc(100% + 48px);
}

.cover {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
}

/* Article Header */
.article-header {
  margin-bottom: 48px;
}

.article-meta-top {
  margin-bottom: 16px;
}

.category {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #666;
  background: #f5f5f5;
  padding: 6px 12px;
  border-radius: 2px;
}

.article-title {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.15;
  color: #111;
  margin: 0 0 20px;
  letter-spacing: -0.02em;
}

.article-subtitle {
  font-family: 'Merriweather', 'Georgia', serif;
  font-size: 1.4rem;
  font-weight: 300;
  line-height: 1.5;
  color: #444;
  margin: 0 0 24px;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 24px;
}

.meta-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.separator {
  color: #ccc;
}

.reading-time {
  color: #888;
}

.views {
  color: #888;
}

.header-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(to right, #111 0%, #111 30%, #e0e0e0 30%, #e0e0e0 100%);
}

/* Article Content */
.article-content {
  font-family: 'Merriweather', 'Georgia', serif;
  font-size: 1.125rem;
  line-height: 1.8;
  color: #333;
}

.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3),
.article-content :deep(h4) {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-weight: 700;
  color: #111;
  margin-top: 48px;
  margin-bottom: 24px;
}

.article-content :deep(h2) {
  font-size: 2rem;
}

.article-content :deep(h3) {
  font-size: 1.5rem;
}

.article-content :deep(p) {
  margin-bottom: 24px;
}

.article-content :deep(a) {
  color: #111;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.article-content :deep(a:hover) {
  text-decoration-thickness: 2px;
}

.article-content :deep(blockquote) {
  margin: 32px 0;
  padding: 24px 32px;
  border-left: 4px solid #111;
  background: #fafafa;
  font-style: italic;
  color: #444;
}

.article-content :deep(pre) {
  background: #1a1a1a;
  color: #f8f8f2;
  padding: 24px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 32px 0;
  font-family: 'Fira Code', 'Monaco', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
}

.article-content :deep(code) {
  font-family: 'Fira Code', 'Monaco', monospace;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.9em;
}

.article-content :deep(pre code) {
  background: transparent;
  padding: 0;
}

.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 32px 0;
  border-radius: 4px;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  margin: 24px 0;
  padding-left: 24px;
}

.article-content :deep(li) {
  margin-bottom: 8px;
}

.article-content :deep(hr) {
  border: none;
  height: 1px;
  background: #e0e0e0;
  margin: 48px 0;
}

/* Article Footer */
.article-footer {
  margin-top: 64px;
}

.footer-divider {
  width: 100%;
  height: 1px;
  background: #e0e0e0;
  margin-bottom: 32px;
}

.tags-section {
  margin-bottom: 32px;
}

.tags-label,
.share-label {
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #888;
  margin-bottom: 12px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #444;
  background: #f5f5f5;
  padding: 8px 16px;
  border-radius: 2px;
  text-decoration: none;
  transition: all 0.2s;
}

.tag:hover {
  background: #111;
  color: #fff;
}

.share-section {
  padding: 24px 0;
}

/* Responsive */
@media (max-width: 768px) {
  .post-detail {
    padding: 0 16px;
  }
  
  .cover-wrapper {
    margin: 0 -16px 32px;
    max-width: calc(100% + 32px);
  }
  
  .article-title {
    font-size: 2rem;
  }
  
  .article-subtitle {
    font-size: 1.1rem;
  }
  
  .article-content {
    font-size: 1rem;
  }
  
  .article-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
