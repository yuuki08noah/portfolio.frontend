<template>
  <section class="book-detail-page container">
    <BookDetail v-if="book" :book="book" />
    <p v-else class="empty">Loading book...</p>

    <div v-if="book" class="card notes-card">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Reading Notes</p>
          <h2>Keep highlights close</h2>
        </div>
        <span v-if="savedMessage" class="status success">{{ savedMessage }}</span>
      </div>
      <ReadingNoteEditor :initial-note="noteDraft" @save="handleSave" />
    </div>
  </section>
</template>

<script setup lang="ts">
import BookDetail from '~/components/reading/BookDetail.vue'
import ReadingNoteEditor from '~/components/reading/ReadingNoteEditor.vue'
import type { ReadingNote } from '~/types'

const route = useRoute()
const { fetchBook } = useReading()

const id = route.params.id as string
const { data: book } = await useAsyncData(`book-${id}`, () =>
  fetchBook(id).then((res) => res.data)
)

const noteDraft = computed<ReadingNote | undefined>(() =>
  book.value
    ? {
        id: `note-${book.value.id}`,
        bookId: book.value.id,
        content: `## Quick thoughts\n- Favorite line goes here\n- Map this book to a milestone`,
        quotes: ['“Travel far enough, you meet yourself.”'],
        tags: book.value.category || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    : undefined
)

const savedMessage = ref('')

const handleSave = (payload: Partial<ReadingNote>) => {
  savedMessage.value = 'Notes saved locally'
  console.info('Saved note', { bookId: id, ...payload })
  setTimeout(() => (savedMessage.value = ''), 2000)
}
</script>

<style scoped>
.book-detail-page {
  padding: var(--spacing-3xl) var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.notes-card {
  padding: var(--spacing-xl);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.85rem;
  color: var(--color-accent);
  margin-bottom: var(--spacing-xs);
  font-weight: 700;
}

.status {
  font-size: 0.9rem;
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-full);
}

.status.success {
  background: rgba(16, 185, 129, 0.12);
  color: var(--color-success);
  border: 1px solid rgba(16, 185, 129, 0.4);
}

.empty {
  color: var(--color-gray-600);
}
</style>
