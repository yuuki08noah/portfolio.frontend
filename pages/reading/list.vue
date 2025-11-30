<template>
  <section class="reading-list container">
    <header class="page-header">
      <h1>📚 Reading List</h1>
      <p class="subtitle">Filter by status to see where each book is in the journey.</p>
      <div class="filters">
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="['pill', { active: activeTab === tab }]"
          @click="activeTab = tab"
        >
          {{ tabLabel(tab) }}
        </button>
      </div>
    </header>

    <div v-if="filteredBooks.length > 0" class="grid grid-3">
      <BookCard v-for="book in filteredBooks" :key="book.id" :book="book" />
    </div>
    <p v-else class="empty">No books found for this filter.</p>
  </section>
</template>

<script setup lang="ts">
import BookCard from '~/components/reading/BookCard.vue'

const { fetchBooks } = useReading()

const { data: books } = await useAsyncData('books', () =>
  fetchBooks().then((res) => res.data)
)

const tabs = ['all', 'reading', 'completed', 'to-read'] as const
const activeTab = ref<(typeof tabs)[number]>('all')

const filteredBooks = computed(() => {
  if (activeTab.value === 'all') return books.value || []
  return (books.value || []).filter((book) => book.status === activeTab.value)
})

const tabLabel = (tab: (typeof tabs)[number]) => {
  if (tab === 'all') return 'All'
  if (tab === 'to-read') return 'To Read'
  return tab.charAt(0).toUpperCase() + tab.slice(1)
}
</script>

<style scoped>
.reading-list {
  padding: var(--spacing-3xl, 48px) var(--spacing-md, 16px);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl, 24px);
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  max-width: 720px;
  margin: 0 auto;
}

.subtitle {
  color: var(--color-gray-600, #666);
}

.filters {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm, 8px);
  margin-top: var(--spacing-md, 16px);
  flex-wrap: wrap;
}

.pill {
  border: 1px solid var(--color-gray-300, #d1d5db);
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.pill:hover {
  border-color: var(--color-text, #111);
}

.pill.active {
  background: var(--color-text, #111);
  border-color: var(--color-text, #111);
  color: white;
}

.grid {
  display: grid;
  gap: 16px;
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.empty {
  text-align: center;
  color: var(--color-gray-600, #666);
  padding: 48px 0;
}

@media (max-width: 768px) {
  .grid-3 {
    grid-template-columns: 1fr;
  }
}
</style>
