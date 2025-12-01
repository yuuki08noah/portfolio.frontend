<template>
  <div class="docs-manage-page">
    <div class="container">
      <header class="page-header">
        <div class="header-left">
          <NuxtLink to="/admin/projects" class="back-link">← Back to Projects</NuxtLink>
          <h1 class="page-title">Documents: {{ projectSlug }}</h1>
        </div>
        <button class="btn-primary" @click="showNewDocModal = true">
          + New Document
        </button>
      </header>

      <div v-if="loading" class="loading">Loading documents...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <template v-else>
        <!-- Category Tabs -->
        <div class="category-tabs">
          <button
            v-for="cat in categories"
            :key="cat.value"
            :class="['tab-btn', { active: activeCategory === cat.value }]"
            @click="activeCategory = cat.value"
          >
            {{ cat.label }}
            <span class="count">{{ getCategoryCount(cat.value) }}</span>
          </button>
        </div>

        <!-- Docs List -->
        <div v-if="filteredDocs.length === 0" class="empty">
          <p>No documents in this category.</p>
          <button class="btn-primary" @click="showNewDocModal = true">Create first document</button>
        </div>
        <div v-else class="docs-list">
          <div v-for="doc in filteredDocs" :key="doc.id" class="doc-item">
            <div class="doc-info">
              <h3 class="doc-title">{{ doc.title }}</h3>
              <div class="doc-meta">
                <span class="category-badge">{{ getCategoryLabel(doc.category) }}</span>
                <span v-if="doc.velogUrl" class="velog-badge">Velog</span>
                <span class="order">Order: {{ doc.order }}</span>
              </div>
            </div>
            <div class="doc-actions">
              <NuxtLink :to="`/projects/${projectSlug}/docs/${doc.category}/${doc.slug}`" class="btn-view" target="_blank">
                View
              </NuxtLink>
              <button class="btn-edit" @click="editDoc(doc)">Edit</button>
              <button class="btn-delete" @click="confirmDelete(doc)">Delete</button>
            </div>
          </div>
        </div>
      </template>

      <!-- New/Edit Document Modal -->
      <div v-if="showNewDocModal || editingDoc" class="modal-overlay" @click.self="closeModal">
        <div class="modal doc-modal">
          <h2>{{ editingDoc ? 'Edit Document' : 'New Document' }}</h2>
          
          <div v-if="docError" class="error-message">{{ docError }}</div>

          <form @submit.prevent="handleDocSubmit">
            <div class="form-group">
              <label for="doc-title">Title *</label>
              <input
                id="doc-title"
                v-model="docForm.title"
                type="text"
                required
                maxlength="200"
                placeholder="Document title"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="doc-category">Category *</label>
                <select id="doc-category" v-model="docForm.category" required>
                  <option value="">Select category</option>
                  <option v-for="cat in categories.slice(1)" :key="cat.value" :value="cat.value">
                    {{ cat.label }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="doc-order">Order</label>
                <input
                  id="doc-order"
                  v-model.number="docForm.order"
                  type="number"
                  min="0"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="doc-content">Content (Markdown) *</label>
              <textarea
                id="doc-content"
                v-model="docForm.content"
                required
                rows="15"
                placeholder="Write your content in Markdown..."
              ></textarea>
            </div>

            <div class="form-group">
              <label for="doc-velog">Velog URL</label>
              <input
                id="doc-velog"
                v-model="docForm.velog_url"
                type="url"
                placeholder="https://velog.io/@username/post"
              />
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="closeModal">Cancel</button>
              <button type="submit" class="btn-submit" :disabled="docSubmitting">
                {{ docSubmitting ? 'Saving...' : (editingDoc ? 'Update' : 'Create') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
        <div class="modal">
          <h2>Delete Document</h2>
          <p>Are you sure you want to delete "{{ deleteTarget.title }}"?</p>
          <div class="modal-actions">
            <button class="btn-cancel" @click="deleteTarget = null">Cancel</button>
            <button class="btn-confirm-delete" :disabled="deleting" @click="handleDelete">
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { ProjectBlogPost } from '~/types/portfolio'

definePageMeta({
  middleware: ['admin'],
  ssr: true
})

const route = useRoute()
const projectSlug = computed(() => route.params.slug as string)

const { fetchProjectDocs, createProjectDoc, updateProjectDoc, deleteProjectDoc } = useProjects()

const docs = ref<ProjectBlogPost[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const activeCategory = ref('all')

const showNewDocModal = ref(false)
const editingDoc = ref<ProjectBlogPost | null>(null)
const docSubmitting = ref(false)

const deleteTarget = ref<ProjectBlogPost | null>(null)
const deleting = ref(false)

const docForm = reactive({
  title: '',
  category: '',
  content: '',
  order: 0,
  velog_url: ''
})

const categories = [
  { value: 'all', label: 'All' },
  { value: 'overview', label: 'Overview' },
  { value: 'technical', label: 'Technical' },
  { value: 'troubleshooting', label: 'Troubleshooting' },
  { value: 'devlog', label: 'Dev Log' },
  { value: 'reference', label: 'Reference' }
]

const filteredDocs = computed(() => {
  if (activeCategory.value === 'all') return docs.value
  return docs.value.filter(d => d.category === activeCategory.value)
})

const getCategoryCount = (cat: string) => {
  if (cat === 'all') return docs.value.length
  return docs.value.filter(d => d.category === cat).length
}

const getCategoryLabel = (cat: string) => {
  return categories.find(c => c.value === cat)?.label || cat
}

const loadDocs = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await fetchProjectDocs(projectSlug.value)
    docs.value = response.docs || []
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to load documents'
  } finally {
    loading.value = false
  }
}

const editDoc = (doc: ProjectBlogPost) => {
  editingDoc.value = doc
  docForm.title = doc.title
  docForm.category = doc.category
  docForm.content = doc.content
  docForm.order = doc.order
  docForm.velog_url = doc.velogUrl || ''
  docError.value = null
}

const closeModal = () => {
  showNewDocModal.value = false
  editingDoc.value = null
  docForm.title = ''
  docForm.category = ''
  docForm.content = ''
  docForm.order = 0
  docForm.velog_url = ''
  docError.value = null
}

const docError = ref<string | null>(null)

const isValidUrl = (url: string): boolean => {
  if (!url) return true
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const handleDocSubmit = async () => {
  docError.value = null

  if (!docForm.title.trim()) {
    docError.value = 'Title is required'
    return
  }
  if (docForm.title.length > 200) {
    docError.value = 'Title must be 200 characters or less'
    return
  }
  if (!docForm.category) {
    docError.value = 'Category is required'
    return
  }
  if (!docForm.content.trim()) {
    docError.value = 'Content is required'
    return
  }
  if (docForm.order < 0) {
    docError.value = 'Order must be 0 or greater'
    return
  }
  if (docForm.velog_url && !isValidUrl(docForm.velog_url)) {
    docError.value = 'Velog URL is not valid'
    return
  }

  docSubmitting.value = true

  try {
    const data = {
      title: docForm.title.trim(),
      category: docForm.category,
      content: docForm.content.trim(),
      order: docForm.order,
      velog_url: docForm.velog_url.trim() || undefined
    }

    if (editingDoc.value) {
      await updateProjectDoc(projectSlug.value, editingDoc.value.category, editingDoc.value.slug, data)
    } else {
      await createProjectDoc(projectSlug.value, data)
    }

    await loadDocs()
    closeModal()
  } catch (e: any) {
    docError.value = e.data?.message || 'Failed to save document'
  } finally {
    docSubmitting.value = false
  }
}

const confirmDelete = (doc: ProjectBlogPost) => {
  deleteTarget.value = doc
}

const handleDelete = async () => {
  if (!deleteTarget.value) return

  deleting.value = true
  try {
    await deleteProjectDoc(projectSlug.value, deleteTarget.value.category, deleteTarget.value.slug)
    docs.value = docs.value.filter(d => d.id !== deleteTarget.value?.id)
    deleteTarget.value = null
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to delete document'
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadDocs()
})
</script>

<style scoped>
.docs-manage-page {
  min-height: 100vh;
  padding: var(--spacing-2xl) 0;
  background: var(--color-bg);
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: var(--spacing-2xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 2px solid var(--color-text);
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.back-link {
  font-size: var(--text-sm);
  color: var(--color-muted);
  text-decoration: none;
}

.back-link:hover {
  color: var(--color-text);
}

.page-title {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 900;
  margin: 0;
}

.btn-primary {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-text);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
}

.btn-primary:hover {
  background: var(--color-accent);
}

.loading, .error, .empty {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-muted);
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.error {
  color: #dc3545;
}

.category-tabs {
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tab-btn:hover {
  border-color: var(--color-text);
}

.tab-btn.active {
  background: var(--color-text);
  color: var(--color-white);
  border-color: var(--color-text);
}

.tab-btn .count {
  font-size: var(--text-xs);
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: var(--radius-sm);
}

.tab-btn.active .count {
  background: rgba(255, 255, 255, 0.2);
}

.docs-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.doc-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}

.doc-item:hover {
  border-color: var(--color-text);
}

.doc-title {
  font-size: var(--text-lg);
  font-weight: 700;
  margin: 0 0 var(--spacing-xs);
}

.doc-meta {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
  font-size: var(--text-xs);
}

.category-badge {
  padding: 2px 8px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  font-weight: 600;
}

.velog-badge {
  padding: 2px 8px;
  background: #20c997;
  color: white;
  border-radius: var(--radius-sm);
  font-weight: 600;
}

.order {
  color: var(--color-muted);
}

.doc-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.btn-view, .btn-edit, .btn-delete {
  padding: 4px 12px;
  font-size: var(--text-xs);
  font-weight: 600;
  border-radius: var(--radius-sm);
  cursor: pointer;
  text-decoration: none;
}

.btn-view {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.btn-edit {
  background: #e3f2fd;
  border: 1px solid #90caf9;
  color: #1976d2;
}

.btn-delete {
  background: #ffebee;
  border: 1px solid #ef9a9a;
  color: #c62828;
}

.btn-view:hover, .btn-edit:hover, .btn-delete:hover {
  opacity: 0.8;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.modal {
  background: var(--color-white);
  padding: var(--spacing-xl);
  border-radius: var(--radius-md);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.doc-modal {
  max-width: 800px;
}

.modal h2 {
  margin: 0 0 var(--spacing-lg);
  font-size: var(--text-xl);
}

.error-message {
  padding: var(--spacing-md);
  background: #ffebee;
  border: 1px solid #ef9a9a;
  border-radius: var(--radius-sm);
  color: #c62828;
  margin-bottom: var(--spacing-lg);
  font-size: var(--text-sm);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  font-size: var(--text-sm);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-base);
  font-family: inherit;
}

.form-group textarea {
  font-family: monospace;
  line-height: 1.5;
}

.form-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-md);
}

.modal-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

.btn-cancel {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.btn-submit {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-text);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 700;
  cursor: pointer;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-confirm-delete {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: #c62828;
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-md);
  }

  .doc-item {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-md);
  }

  .doc-actions {
    justify-content: flex-end;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
