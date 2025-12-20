<template>
  <div class="book-detail">
    <!-- Left Column: Cover -->
    <div class="book-cover-column">
      <div v-if="book.coverImage" class="cover-wrapper">
        <img :src="book.coverImage" :alt="displayTitle" class="cover-image" />
      </div>
      <div v-else class="cover-placeholder">
        <span>No Cover</span>
      </div>
    </div>

    <!-- Right Column: Info & Content -->
    <div class="book-info-column">
      <header class="book-header">
        <h1 class="title">{{ displayTitle }}</h1>
        <p class="author">by {{ displayAuthor }}</p>
        
        <div class="meta-row">
          <span class="status-badge" :class="book.status">{{ formatStatus(book.status) }}</span>
          <span v-if="book.publisher" class="publisher">{{ book.publisher }}</span>
          <span v-if="book.pages" class="pages">{{ book.pages }} pages</span>
        </div>

        <div v-if="book.rating" class="rating-row">
          <div class="stars" :aria-label="`Rating: ${book.rating} out of 5`">
            <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(book.rating) }">★</span>
          </div>
          <span class="rating-value">{{ book.rating }}/5</span>
        </div>
      </header>

      <div v-if="book.category && book.category.length > 0" class="categories-section">
        <div class="category-tags">
          <span v-for="cat in book.category" :key="cat" class="category-tag">{{ cat }}</span>
        </div>
      </div>
      
      <div v-if="displayReview" class="review-section">
        <h3>Review</h3>
        <div class="review-content">
          {{ displayReview }}
        </div>
      </div>

      <div v-if="book.startDate || book.endDate" class="dates-section">
        <p v-if="book.startDate" class="date-item">
          <span class="label">Started</span>
          <span class="value">{{ formatDate(book.startDate) }}</span>
        </p>
        <p v-if="book.endDate" class="date-item">
          <span class="label">Finished</span>
          <span class="value">{{ formatDate(book.endDate) }}</span>
        </p>
      </div>
    </div>
  </div>
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
const displayReview = computed(() => t(
  props.book.review || '',
  props.book.translations?.ko?.review,
  props.book.translations?.ja?.review
))

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')
}
</script>

<style scoped>
.book-detail {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-2xl);
  animation: fadeIn 0.6s ease-out;
}

@media (min-width: 768px) {
  .book-detail {
    grid-template-columns: 300px 1fr;
    gap: var(--spacing-3xl);
  }
}

/* Cover Column */
.cover-wrapper {
  width: 100%;
  aspect-ratio: 2/3;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  transition: transform 0.3s ease;
}

.cover-wrapper:hover {
  transform: translateY(-4px);
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  width: 100%;
  aspect-ratio: 2/3;
  background-color: var(--color-gray-200);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-500);
  font-weight: 500;
}

/* Info Column */
.book-header {
  margin-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-lg);
}

.title {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: var(--spacing-xs);
  background: linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-text-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.author {
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  font-weight: 500;
  margin-bottom: var(--spacing-md);
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  font-size: 0.95rem;
  color: var(--color-gray-600);
}

.publisher::before, .pages::before {
  content: "•";
  margin-right: var(--spacing-md);
  color: var(--color-gray-400);
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-badge.reading { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.status-badge.completed { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.status-badge.to-read { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }

.rating-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: var(--color-gray-300);
  font-size: 1.2rem;
}

.star.filled {
  color: #fbbf24;
}

.rating-value {
  font-weight: 600;
  color: var(--color-text-primary);
  margin-left: var(--spacing-xs);
}

/* Categories */
.categories-section {
  margin-bottom: var(--spacing-xl);
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.category-tag {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  padding: 0.4rem 1rem;
  border-radius: var(--radius-full);
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
  border: 1px solid var(--color-border);
}

.category-tag:hover {
  background-color: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

/* Review */
.review-section {
  margin-bottom: var(--spacing-xl);
}

.review-section h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
}

.review-content {
  line-height: 1.7;
  color: var(--color-text-secondary);
  font-size: 1.05rem;
  background: var(--color-bg-secondary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--color-accent);
}

/* Dates */
.dates-section {
  display: flex;
  gap: var(--spacing-xl);
  border-top: 1px solid var(--color-border);
  padding-top: var(--spacing-lg);
}

.date-item {
  display: flex;
  flex-direction: column;
}

.date-item .label {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--color-gray-500);
  margin-bottom: 4px;
  font-weight: 600;
}

.date-item .value {
  font-weight: 500;
  color: var(--color-text-primary);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
