<template>
  <AdminLayout title="Books" subtitle="Manage your reading list with multi-language support">
    <template #actions>
      <button class="btn btn-primary" @click="showModal = true">+ Add Book</button>
    </template>

    <div v-if="loading" class="admin-loading">Loading books...</div>
    
    <div v-else class="admin-list">
      <div v-for="book in books" :key="book.id" class="admin-list-item">
        <div class="book-cover">
          <img v-if="book.coverImage" :src="book.coverImage" :alt="book.title" />
          <span v-else class="cover-placeholder">📚</span>
        </div>
        <div class="admin-list-item-info">
          <h3 class="admin-list-item-title">{{ book.title }}</h3>
          <p v-if="book.translations?.ko?.title" class="admin-list-item-trans">KO: {{ book.translations.ko.title }}</p>
          <p v-if="book.translations?.ja?.title" class="admin-list-item-trans">JA: {{ book.translations.ja.title }}</p>
          <p class="admin-list-item-meta">{{ book.author }} · <span :class="['badge', statusClass(book.status)]">{{ book.status }}</span></p>
        </div>
        <div class="admin-list-item-actions">
          <button class="btn btn-secondary btn-sm" @click="editBook(book)">Edit</button>
          <button class="btn btn-danger btn-sm" @click="deleteBook(book.id)">Delete</button>
        </div>
      </div>
      <div v-if="books.length === 0" class="admin-empty">No books yet. Add your first book!</div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">{{ editingBook ? 'Edit Book' : 'Add Book' }}</h2>
        </div>
        
        <LangTabs v-model="activeLang" />

        <form @submit.prevent="saveBook">
          <!-- English -->
          <div v-show="activeLang === 'en'">
            <div class="form-field">
              <label class="form-label">Title (EN) *</label>
              <input v-model="form.title" type="text" class="form-input" />
            </div>
            <div class="form-field">
              <label class="form-label">Author (EN) *</label>
              <input v-model="form.author" type="text" class="form-input" />
            </div>
            <div class="form-field">
              <label class="form-label">Review (EN)</label>
              <textarea v-model="form.review" class="form-textarea" rows="3"></textarea>
            </div>
          </div>

          <!-- Korean -->
          <div v-show="activeLang === 'ko'">
            <div class="form-field">
              <label class="form-label">제목 (KO)</label>
              <input v-model="form.translations.ko.title" type="text" class="form-input" placeholder="한국어 제목" />
            </div>
            <div class="form-field">
              <label class="form-label">저자 (KO)</label>
              <input v-model="form.translations.ko.author" type="text" class="form-input" placeholder="한국어 저자명" />
            </div>
            <div class="form-field">
              <label class="form-label">리뷰 (KO)</label>
              <textarea v-model="form.translations.ko.review" class="form-textarea" rows="3" placeholder="한국어 리뷰"></textarea>
            </div>
          </div>

          <!-- Japanese -->
          <div v-show="activeLang === 'ja'">
            <div class="form-field">
              <label class="form-label">タイトル (JA)</label>
              <input v-model="form.translations.ja.title" type="text" class="form-input" placeholder="日本語タイトル" />
            </div>
            <div class="form-field">
              <label class="form-label">著者 (JA)</label>
              <input v-model="form.translations.ja.author" type="text" class="form-input" placeholder="日本語著者名" />
            </div>
            <div class="form-field">
              <label class="form-label">レビュー (JA)</label>
              <textarea v-model="form.translations.ja.review" class="form-textarea" rows="3" placeholder="日本語レビュー"></textarea>
            </div>
          </div>

          <div class="form-divider">Common Settings</div>
          
          <div class="form-grid">
            <div class="form-field">
              <label class="form-label">Status</label>
              <select v-model="form.status" class="form-input">
                <option value="to-read">To Read</option>
                <option value="reading">Reading</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div class="form-field">
              <label class="form-label">Rating</label>
              <select v-model="form.rating" class="form-input">
                <option :value="null">-</option>
                <option v-for="i in 5" :key="i" :value="i">{{ i }} ★</option>
              </select>
            </div>
            <div class="form-field">
              <label class="form-label">Start Date</label>
              <input v-model="form.startDate" type="date" class="form-input" />
            </div>
            <div class="form-field">
              <label class="form-label">End Date</label>
              <input v-model="form.endDate" type="date" class="form-input" />
            </div>
            <div class="form-field full">
              <label class="form-label">Cover Image URL</label>
              <input v-model="form.coverImage" type="text" class="form-input" placeholder="https://..." />
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button type="submit" class="btn btn-primary">{{ editingBook ? 'Update' : 'Add' }}</button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import type { Book } from '~/types'
import AdminLayout from '~/components/admin/AdminLayout.vue'
import LangTabs from '~/components/admin/LangTabs.vue'
import '~/assets/css/admin.css'

definePageMeta({
  middleware: ['auth'],
  ssr: true
})

const { fetchBooks, createBook, updateBook, deleteBook: removeBook } = useReading()

const loading = ref(true)
const books = ref<Book[]>([])
const showModal = ref(false)
const editingBook = ref<Book | null>(null)
const activeLang = ref<'en' | 'ko' | 'ja'>('en')

interface BookFormTranslation {
  title: string
  author: string
  review: string
}

interface BookForm {
  title: string
  author: string
  status: 'to-read' | 'reading' | 'completed'
  rating: number | null
  startDate: string
  endDate: string
  coverImage: string
  review: string
  translations: {
    ko: BookFormTranslation
    ja: BookFormTranslation
  }
}

const defaultForm: BookForm = {
  title: '',
  author: '',
  status: 'to-read',
  rating: null,
  startDate: '',
  endDate: '',
  coverImage: '',
  review: '',
  translations: {
    ko: { title: '', author: '', review: '' },
    ja: { title: '', author: '', review: '' }
  }
}

const form = ref<BookForm>({ ...defaultForm, translations: { ko: { ...defaultForm.translations.ko }, ja: { ...defaultForm.translations.ja } } })

const statusClass = (status: string) => {
  switch (status) {
    case 'completed': return 'badge-success'
    case 'reading': return 'badge-info'
    default: return 'badge-warning'
  }
}

onMounted(async () => {
  await loadBooks()
})

const loadBooks = async () => {
  loading.value = true
  try {
    const res = await fetchBooks()
    books.value = res.data || []
  } catch (e) {
    console.error('Failed to load books', e)
  } finally {
    loading.value = false
  }
}

const editBook = (book: Book) => {
  editingBook.value = book
  form.value = {
    title: book.title,
    author: book.author,
    status: book.status,
    rating: book.rating || null,
    startDate: book.startDate || '',
    endDate: book.endDate || '',
    coverImage: book.coverImage || '',
    review: book.review || '',
    translations: {
      ko: {
        title: book.translations?.ko?.title || '',
        author: book.translations?.ko?.author || '',
        review: book.translations?.ko?.review || ''
      },
      ja: {
        title: book.translations?.ja?.title || '',
        author: book.translations?.ja?.author || '',
        review: book.translations?.ja?.review || ''
      }
    }
  }
  activeLang.value = 'en'
  showModal.value = true
}

const saveBook = async () => {
  // Manual Validation
  if (!form.value.title || !form.value.author) {
    alert('Please enter Title and Author in English tab.')
    activeLang.value = 'en'
    return
  }

  console.log('saveBook called. Form data:', form.value)
  try {
    const data = {
      title: form.value.title,
      author: form.value.author,
      status: form.value.status,
      rating: form.value.rating || undefined,
      start_date: form.value.startDate || undefined,
      end_date: form.value.endDate || undefined,
      cover_image: form.value.coverImage,
      review: form.value.review,
      translations: {
        ko: form.value.translations.ko,
        ja: form.value.translations.ja
      }
    }
    
    if (editingBook.value) {
      await updateBook(editingBook.value.id, data)
    } else {
      await createBook(data)
    }
    closeModal()
    await loadBooks()
  } catch (e: any) {
    console.error('Failed to save book', e)
    const message = e.data?.errors?.join(', ') || e.data?.message || e.message || 'Failed to save book'
    alert(`Error: ${message}`)
  }
}

const deleteBook = async (id: string) => {
  if (!confirm('Delete this book?')) return
  try {
    await removeBook(id)
    await loadBooks()
  } catch (e) {
    console.error('Failed to delete book', e)
  }
}

const closeModal = () => {
  showModal.value = false
  editingBook.value = null
  activeLang.value = 'en'
  form.value = { ...defaultForm, translations: { ko: { ...defaultForm.translations.ko }, ja: { ...defaultForm.translations.ja } } }
}
</script>

<style scoped>
.book-cover {
  width: 50px;
  height: 70px;
  flex-shrink: 0;
  background: #f3f4f6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-right: 16px;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  font-size: 1.5rem;
}

.form-field {
  margin-bottom: 16px;
}

.form-field.full {
  grid-column: 1 / -1;
}
</style>
