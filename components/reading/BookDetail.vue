<template>
  <div class="book-detail">
    <div class="book-header">
      <div v-if="book.coverImage" class="cover-large">
        <img :src="book.coverImage" :alt="displayTitle" />
      </div>
      
      <div class="book-info">
        <h1>{{ displayTitle }}</h1>
        <p class="author">by {{ displayAuthor }}</p>
        <p v-if="book.publisher" class="publisher">{{ book.publisher }}</p>
        
        <div class="meta">
          <span class="status-badge" :class="book.status">{{ book.status }}</span>
          <span v-if="book.pages">{{ book.pages }} pages</span>
        </div>
        
        <div v-if="book.rating" class="rating-large">
          ⭐ {{ book.rating }}/5
        </div>
        
        <div v-if="book.startDate || book.endDate" class="dates">
          <p v-if="book.startDate">Started: {{ formatDate(book.startDate) }}</p>
          <p v-if="book.endDate">Finished: {{ formatDate(book.endDate) }}</p>
        </div>
      </div>
    </div>
    
    <div v-if="displayReview" class="review">
      <h3>My Review</h3>
      <p>{{ displayReview }}</p>
    </div>
    
    <div v-if="book.category && book.category.length > 0" class="categories">
      <h3>Categories</h3>
      <div class="category-tags">
        <span v-for="cat in book.category" :key="cat" class="tag">{{ cat }}</span>
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
  return new Date(date).toLocaleDateString()
}
</script>
