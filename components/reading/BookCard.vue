<template>
  <NuxtLink :to="`/reading/book/${book.id}`" class="book-card">
    <div v-if="book.coverImage" class="cover">
      <img :src="book.coverImage" :alt="displayTitle" />
    </div>
    <div v-else class="cover-placeholder">
      📚
    </div>
    
    <div class="content">
      <h3>{{ displayTitle }}</h3>
      <p class="author">{{ displayAuthor }}</p>
      <span class="status-badge" :class="book.status">{{ book.status }}</span>
      <div v-if="book.rating" class="rating">
        ⭐ {{ book.rating }}/5
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Book } from '~/types'

const props = defineProps<{
  book: Book
}>()

const { t } = useI18n()

const displayTitle = computed(() => t(
  props.book.title,
  props.book.translations?.ko?.title,
  props.book.translations?.ja?.title
))
const displayAuthor = computed(() => t(
  props.book.author,
  props.book.translations?.ko?.author,
  props.book.translations?.ja?.author
))
</script>

<style scoped>
.book-card {
  display: flex;
  flex-direction: column;
  background: var(--color-white, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
}

.book-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cover {
  height: 180px;
  overflow: hidden;
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-size: 3rem;
}

.content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.content h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.author {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-muted, #666);
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  width: fit-content;
}

.status-badge.completed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.reading {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.to-read {
  background: #fef3c7;
  color: #92400e;
}

.rating {
  font-size: 0.85rem;
  color: var(--color-muted, #666);
}
</style>
