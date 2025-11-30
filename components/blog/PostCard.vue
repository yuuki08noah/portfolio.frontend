<template>
  <NuxtLink :to="`/blog/post/${post.slug}`" class="post-card">
    <div class="card-image" v-if="post.cover_image">
      <img :src="post.cover_image" :alt="post.title" />
    </div>
    <div class="card-image placeholder" v-else>
      <span>No Image</span>
    </div>
    <div class="card-content">
      <div class="card-meta">
        <span class="date">{{ formatDate(post.published_at || post.created_at) }}</span>
        <span class="divider">•</span>
        <span class="views">{{ post.views || 0 }} views</span>
      </div>
      <h3 class="card-title">{{ post.title }}</h3>
      <p class="card-subtitle" v-if="post.subtitle">{{ post.subtitle }}</p>
      <p class="card-excerpt" v-if="post.excerpt">{{ post.excerpt }}</p>
      <div class="card-tags" v-if="post.tags?.length">
        <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/types'

defineProps<{
  post: BlogPost
}>()

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
.post-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
}

.card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f5f5;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.post-card:hover .card-image img {
  transform: scale(1.05);
}

.card-image.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
}

.card-content {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-meta {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-meta .divider {
  margin: 0 8px;
}

.card-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 8px;
  line-height: 1.3;
}

.card-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #444;
  margin: 0 0 12px;
  line-height: 1.5;
}

.card-excerpt {
  font-family: 'Merriweather', serif;
  font-size: 0.95rem;
  color: #666;
  margin: 0 0 16px;
  line-height: 1.6;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: auto;
}

.tag {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: #666;
  background: #f5f5f5;
  padding: 4px 10px;
  border-radius: 2px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
