<template>
  <div class="reading-page">
    <div class="reading-container">
      <!-- Hero Header -->
      <header class="reading-header">
        <h1 class="page-title">Reading</h1>
        <div class="hero-divider"></div>
        <p class="page-subtitle">
          A curated collection of books that have shaped my thinking and expanded my horizons.
        </p>
      </header>



      <!-- Stats Overview -->
      <section class="stats-section">
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">{{ stats?.total || 0 }}</span>
            <span class="stat-label">Total Books</span>
          </div>
          <div class="stat-item highlight">
            <span class="stat-number">{{ stats?.booksThisYear || 0 }}</span>
            <span class="stat-label">Read This Year</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ readingNow.length }}</span>
            <span class="stat-label">In Progress</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ stats?.totalPages?.toLocaleString() || 0 }}</span>
            <span class="stat-label">Pages Read</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ stats?.averageRating?.toFixed(1) || '—' }}</span>
            <span class="stat-label">Avg Rating</span>
          </div>
        </div>
      </section>

      <!-- Main Content Grid -->
      <div class="main-grid">
        <!-- Left Column: Currently Reading -->
        <section class="content-main">
          <div class="section-header">
            <div>
              <span class="section-label">Now Reading</span>
              <h2 class="section-title">Currently on my desk</h2>
            </div>
          </div>
          
          <div v-if="readingNow.length > 0" class="featured-books">
            <article v-for="book in readingNow" :key="book.id" class="book-featured">
              <div class="book-cover-large">
                <div v-if="book.coverImage" class="cover-image">
                  <img :src="book.coverImage" :alt="getTranslated(book, 'title')" />
                </div>
                <div v-else class="cover-placeholder">
                  <span class="book-icon">📖</span>
                </div>
              </div>
              <div class="book-info">
                <NuxtLink :to="`/reading/book/${book.id}`" class="book-title-large">{{ getTranslated(book, 'title') }}</NuxtLink>
                <p class="book-author">by {{ getTranslated(book, 'author') }}</p>
                <div class="book-meta">
                  <span v-if="book.pages" class="meta-item">{{ book.pages }} pages</span>
                  <span v-for="cat in book.category?.slice(0, 2)" :key="cat" class="meta-item">{{ cat }}</span>
                </div>
                <p v-if="book.startDate" class="started-date">Started {{ formatDate(book.startDate) }}</p>
              </div>
            </article>
          </div>
          <div v-else class="empty-state">
            <p>No books currently in progress.</p>
            <NuxtLink to="/reading/list" class="browse-link">Browse your reading list →</NuxtLink>
          </div>

          <div class="divider-short"></div>

          <!-- Recently Completed Grid -->
          <div class="section-header">
            <div>
              <span class="section-label">Recent Reads</span>
              <h2 class="section-title">Recently finished</h2>
            </div>
            <NuxtLink to="/reading/list?status=completed" class="text-link">View all →</NuxtLink>
          </div>
          
          <div v-if="recentCompleted.length > 0" class="books-grid-3">
            <article v-for="book in recentCompleted" :key="book.id" class="book-card">
              <NuxtLink :to="`/reading/book/${book.id}`" class="book-card-link">
                <div class="book-cover-medium">
                  <div v-if="book.coverImage" class="cover-image">
                    <img :src="book.coverImage" :alt="getTranslated(book, 'title')" />
                  </div>
                  <div v-else class="cover-placeholder-medium">📚</div>
                </div>
                <div class="book-card-info">
                  <h3 class="book-card-title">{{ getTranslated(book, 'title') }}</h3>
                  <p class="book-card-author">{{ getTranslated(book, 'author') }}</p>
                  <div v-if="book.rating" class="rating">
                    <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= book.rating }">★</span>
                  </div>
                </div>
              </NuxtLink>
            </article>
          </div>
          <div v-else class="empty-state small">
            <p>Complete a book to see it appear here.</p>
          </div>
        </section>

        <!-- Right Sidebar -->
        <aside class="content-sidebar">
          <!-- Reading Goal -->
          <div v-if="activeGoal" class="sidebar-card goal-card">
            <div class="sidebar-header">
              <span class="section-label">{{ activeGoal.year }} Goal</span>
              <NuxtLink to="/reading/goals" class="text-link-small">Edit</NuxtLink>
            </div>
            <div class="goal-numbers">
              <span class="goal-current">{{ activeGoal.currentBooks }}</span>
              <span class="goal-separator">/</span>
              <span class="goal-target">{{ activeGoal.targetBooks }}</span>
            </div>
            <div class="goal-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${Math.round(activeGoal.progress * 100)}%` }"></div>
              </div>
              <span class="progress-text">{{ Math.round(activeGoal.progress * 100) }}% complete</span>
            </div>
            <p class="goal-remaining">{{ activeGoal.targetBooks - activeGoal.currentBooks }} books to go</p>
          </div>

          <!-- To Read List -->
          <div class="sidebar-card">
            <div class="sidebar-header">
              <span class="section-label">Up Next</span>
              <NuxtLink to="/reading/list?status=to-read" class="text-link-small">View all</NuxtLink>
            </div>
            <div v-if="toRead.length > 0" class="to-read-list">
              <div v-for="book in toRead.slice(0, 5)" :key="book.id" class="to-read-item">
                <span class="to-read-title">{{ getTranslated(book, 'title') }}</span>
                <span class="to-read-author">{{ getTranslated(book, 'author') }}</span>
              </div>
            </div>
            <p v-else class="empty-small">No books in your queue.</p>
          </div>

          <!-- Quick Links -->
          <nav class="sidebar-nav">
            <NuxtLink to="/reading/list" class="sidebar-nav-link">
              <span>📚</span> All Books
            </NuxtLink>
            <NuxtLink to="/reading/stats" class="sidebar-nav-link">
              <span>📊</span> Statistics
            </NuxtLink>
            <NuxtLink to="/reading/goals" class="sidebar-nav-link">
              <span>🎯</span> Goals
            </NuxtLink>
          </nav>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Book } from '~/types/reading'

const { locale } = useI18n()
const { fetchBooks, fetchReadingStats, fetchReadingGoals } = useReading()

// 번역된 값 반환 헬퍼
const getTranslated = (book: Book, field: 'title' | 'author' | 'review') => {
  if (locale.value === 'ko' && book.translations?.ko?.[field]) {
    return book.translations.ko[field]
  }
  if (locale.value === 'ja' && book.translations?.ja?.[field]) {
    return book.translations.ja[field]
  }
  return book[field]
}

const { data: books } = await useAsyncData('reading-books', () =>
  fetchBooks().then((res) => res.data)
)
const { data: stats } = await useAsyncData('reading-stats', () =>
  fetchReadingStats().then((res) => res.data)
)
const { data: goals } = await useAsyncData('reading-goals', () =>
  fetchReadingGoals().then((res) => res.data)
)

const readingNow = computed(() => (books.value || []).filter((book) => book.status === 'reading'))
const recentCompleted = computed(() =>
  (books.value || [])
    .filter((book) => book.status === 'completed')
    .sort((a, b) => (b.endDate || '').localeCompare(a.endDate || ''))
    .slice(0, 6)
)
const toRead = computed(() => (books.value || []).filter((book) => book.status === 'to-read'))
const activeGoal = computed(() => goals.value?.[0])

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600&display=swap');

.reading-page {
  background-color: #fff;
  min-height: 100vh;
  color: #1a1a1a;
  font-family: 'Merriweather', serif;
}

.reading-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 100px 60px 80px;
}

/* Header */
.reading-header {
  margin-bottom: 60px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 60px;
}

.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 4rem;
  font-weight: 700;
  margin: 0 0 30px 0;
  color: #111;
  letter-spacing: -1px;
}

.hero-divider {
  width: 60px;
  height: 2px;
  background-color: #111;
  margin-bottom: 20px;
}

.page-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  max-width: 600px;
}

.divider-line {
  height: 1px;
  background: #e0e0e0;
  margin: 48px 0;
}

.divider-short {
  width: 80px;
  height: 2px;
  background: #111;
  margin: 56px 0;
}

/* Stats */
.stats-section {
  margin-bottom: 56px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 32px 20px;
  background: #fff;
  border: 1px solid #e5e7eb;
}

.stat-item.highlight {
  background: #111;
  border-color: #111;
}

.stat-item.highlight .stat-number,
.stat-item.highlight .stat-label {
  color: #fff;
}

.stat-number {
  display: block;
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 700;
  color: #111;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #888;
  font-weight: 500;
}

/* Main Grid Layout */
.main-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 60px;
}

.content-main {
  min-width: 0;
}

/* Section Headers */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 600;
  margin: 8px 0 0 0;
  color: #111;
}

.text-link {
  font-size: 0.9rem;
  font-weight: 500;
  color: #111;
  text-decoration: none;
  border-bottom: 1px solid #111;
  padding-bottom: 2px;
  transition: opacity 0.2s;
}

.text-link:hover {
  opacity: 0.6;
}

/* Featured Books (Currently Reading) */
.featured-books {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.book-featured {
  display: flex;
  gap: 32px;
  padding: 32px;
  background: #fff;
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.3s;
}

.book-featured:hover {
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
}

.book-cover-large {
  flex-shrink: 0;
  width: 160px;
}

.book-cover-large .cover-image img {
  width: 160px;
  height: 240px;
  object-fit: cover;
}

.cover-placeholder {
  width: 160px;
  height: 240px;
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.book-icon {
  font-size: 3rem;
}

.book-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 8px 0;
}

.book-title-large {
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  font-weight: 600;
  color: #111;
  text-decoration: none;
  line-height: 1.3;
  margin-bottom: 8px;
}

.book-title-large:hover {
  text-decoration: underline;
}

.book-author {
  font-size: 1rem;
  color: #666;
  margin: 0 0 20px 0;
}

.book-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: auto;
}

.meta-item {
  font-size: 0.8rem;
  color: #666;
  background: #f5f5f5;
  padding: 6px 12px;
  border-radius: 2px;
}

.started-date {
  font-size: 0.9rem;
  color: #888;
  margin: 20px 0 0 0;
  font-style: italic;
}

/* Books Grid (Recently Completed) */
.books-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.book-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  transition: all 0.3s;
}

.book-card:hover {
  border-color: #111;
}

.book-card-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.book-cover-medium {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.book-cover-medium .cover-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder-medium {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.book-card-info {
  padding: 20px;
}

.book-card-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 6px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-card-author {
  font-size: 0.85rem;
  color: #888;
  margin: 0 0 12px 0;
}

.rating {
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 0.9rem;
}

.star.filled {
  color: #111;
}

/* Sidebar */
.content-sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  padding: 28px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.text-link-small {
  font-size: 0.8rem;
  color: #888;
  text-decoration: none;
}

.text-link-small:hover {
  color: #111;
}

/* Goal Card */
.goal-card {
  background: #111;
  border-color: #111;
}

.goal-card .section-label {
  color: #888;
}

.goal-card .text-link-small {
  color: #666;
}

.goal-card .text-link-small:hover {
  color: #fff;
}

.goal-numbers {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 20px;
}

.goal-current {
  font-family: 'Playfair Display', serif;
  font-size: 4rem;
  font-weight: 700;
  color: #fff;
  line-height: 1;
}

.goal-separator {
  font-size: 2rem;
  color: #666;
}

.goal-target {
  font-size: 1.5rem;
  color: #666;
}

.goal-progress {
  margin-bottom: 12px;
}

.progress-bar {
  height: 4px;
  background: #333;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: #fff;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 0.8rem;
  color: #888;
}

.goal-remaining {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
}

/* To Read List */
.to-read-list {
  display: flex;
  flex-direction: column;
}

.to-read-item {
  display: flex;
  flex-direction: column;
  padding: 14px 0;
  border-bottom: 1px solid #f0f0f0;
}

.to-read-item:last-child {
  border-bottom: none;
}

.to-read-title {
  font-weight: 500;
  font-size: 0.95rem;
  margin-bottom: 2px;
}

.to-read-author {
  font-size: 0.8rem;
  color: #888;
}

/* Sidebar Nav */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: #fff;
  border: 1px solid #e5e7eb;
  text-decoration: none;
  color: #111;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
}

.sidebar-nav-link:hover {
  background: #111;
  color: #fff;
  border-color: #111;
}

/* Empty States */
.empty-state {
  text-align: center;
  padding: 64px 32px;
  background: #fff;
  border: 1px dashed #e5e7eb;
}

.empty-state.small {
  padding: 40px 24px;
}

.empty-state p {
  color: #888;
  margin: 0 0 16px 0;
}

.browse-link {
  font-size: 0.9rem;
  color: #111;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid #111;
}

.empty-small {
  color: #888;
  font-size: 0.9rem;
  margin: 0;
}

/* Responsive */
@media (max-width: 1200px) {
  .reading-container {
    padding: 48px 32px;
  }
  
  .main-grid {
    grid-template-columns: 1fr 300px;
    gap: 40px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
  }
  
  .books-grid-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .reading-container {
    padding: 40px 24px;
  }
  
  .page-title {
    font-size: 3rem;
  }
  
  .main-grid {
    grid-template-columns: 1fr;
    gap: 48px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .book-featured {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .book-meta {
    justify-content: center;
  }
  
  .books-grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 600px) {
  .reading-container {
    padding: 32px 16px;
  }
  
  .page-title {
    font-size: 2.5rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .books-grid-3 {
    grid-template-columns: 1fr;
  }
  
  .sidebar-nav {
    flex-direction: row;
  }
  
  .sidebar-nav-link {
    flex: 1;
    justify-content: center;
  }
}
</style>
