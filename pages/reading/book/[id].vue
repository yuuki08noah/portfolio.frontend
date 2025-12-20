<template>
  <section class="book-detail-page container">
    <BookDetail v-if="book" :book="book" />
    <div v-else-if="error" class="error-state">
      <h3>Failed to load book</h3>
      <p>{{ error.message }}</p>
      <pre>{{ error }}</pre>
    </div>
    <p v-else class="empty">Loading book...</p>
  </section>
</template>

<script setup lang="ts">
import BookDetail from '~/components/reading/BookDetail.vue'

const route = useRoute()
const { fetchBook } = useReading()

const id = route.params.id as string
const { data: book, error } = await useAsyncData(`book-${id}`, () =>
  fetchBook(id).then((res) => res.data)
)
</script>

<style scoped>
.book-detail-page {
  padding: var(--spacing-3xl) var(--spacing-md);
  max-width: 1200px;
  margin: 0 auto;
}

.error-state {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--color-error);
}

.empty {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--color-gray-600);
}
</style>
