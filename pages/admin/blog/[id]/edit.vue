<template>
  <div class="edit-blog-page">
    <div class="page-header">
      <NuxtLink to="/admin/blog" class="back-link">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Back to Blog
      </NuxtLink>
      <h1>Edit Blog Post</h1>
    </div>

    <div v-if="loading" class="loading">Loading post...</div>
    <div v-else-if="error" class="error-banner">{{ error }}</div>
    <template v-else>
      <div class="step-indicator">
        <div :class="['step', { active: step === 1, completed: step > 1 }]">
          <div class="step-number">1</div>
          <span>Basic Information</span>
        </div>
        <div class="step-divider"></div>
        <div :class="['step', { active: step === 2 }]">
          <div class="step-number">2</div>
          <span>Content</span>
        </div>
      </div>

      <div v-show="step === 1" class="step-content">
        <div class="form-section">
          <div class="form-group">
            <label for="title">Title *</label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              placeholder="Enter blog post title"
              maxlength="200"
            />
          </div>

          <div class="form-group">
            <label for="subtitle">Subtitle</label>
            <input
              id="subtitle"
              v-model="form.subtitle"
              type="text"
              placeholder="Optional subtitle"
              maxlength="500"
            />
          </div>

          <div class="form-group">
            <label for="slug">Slug *</label>
            <input
              id="slug"
              v-model="form.slug"
              type="text"
              placeholder="url-friendly-slug"
            />
            <small>URL: /blog/{{ form.slug || 'your-slug' }}</small>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="status">Status *</label>
              <select id="status" v-model="form.status">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div class="form-group">
              <label for="category">Category</label>
              <input
                id="category"
                v-model="form.category_id"
                type="text"
                placeholder="Category ID (optional)"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="tags">Tags</label>
            <div class="tags-input">
              <div class="tag-list">
                <span v-for="(tag, index) in form.tags" :key="index" class="tag">
                  {{ tag }}
                  <button type="button" @click="removeTag(index)">×</button>
                </span>
              </div>
              <input
                v-model="tagInput"
                type="text"
                placeholder="Add a tag and press Enter"
                @keydown.enter.prevent="addTag"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="published_at">Publish Date</label>
            <input
              id="published_at"
              v-model="form.published_at"
              type="datetime-local"
            />
          </div>

          <div class="form-actions">
            <button type="button" class="btn-save" @click="saveBasicInfo" :disabled="submitting || !canProceed">
              {{ submitting ? 'Saving...' : 'Save Changes' }}
            </button>
            <button type="button" class="btn-next" @click="goToStep2" :disabled="!canProceed">
              Next: Edit Content
            </button>
          </div>
        </div>
      </div>

      <div v-show="step === 2" class="step-content full-height">
        <div class="editor-container">
          <div class="editor-header">
            <h2>Content Editor</h2>
            <div class="editor-actions">
              <button type="button" class="btn-draft" :class="{ saved: draftSaved }" :disabled="submitting" @click="saveDraft">
                {{ draftSaved ? 'Saved!' : 'Save Draft' }}
              </button>
              <button type="button" class="btn-back" @click="step = 1">Back to Basic Info</button>
              <button type="button" class="btn-submit" @click="handleSubmit" :disabled="submitting">
                {{ submitting ? 'Saving...' : 'Save All Changes' }}
              </button>
            </div>
          </div>
          <MarkdownEditor v-model="form.content" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import MarkdownEditor from '~/components/admin/MarkdownEditor.vue'

definePageMeta({
  middleware: ['admin'],
  layout: false
})

const route = useRoute()
const postId = computed(() => route.params.id as string)

const { fetchBlogPost, updateBlogPost } = useBlogPosts()

const step = ref(1)
const loading = ref(true)
const error = ref<string | null>(null)
const submitting = ref(false)
const tagInput = ref('')
const draftSaved = ref(false)

const getDraftKey = () => `blog_draft_edit_${postId.value}`

const form = ref({
  title: '',
  subtitle: '',
  slug: '',
  content: '',
  status: 'draft' as 'draft' | 'published' | 'archived',
  tags: [] as string[],
  category_id: '',
  published_at: ''
})

const canProceed = computed(() => {
  return form.value.title.trim().length > 0 && form.value.slug.trim().length > 0
})

const loadDraft = () => {
  if (process.client) {
    const saved = localStorage.getItem(getDraftKey())
    if (saved) {
      try {
        const data = JSON.parse(saved)
        form.value.title = data.title || ''
        form.value.subtitle = data.subtitle || ''
        form.value.slug = data.slug || ''
        form.value.content = data.content || ''
        form.value.status = data.status || 'draft'
        form.value.tags = Array.isArray(data.tags) ? data.tags : []
        form.value.category_id = data.category_id || ''
        form.value.published_at = data.published_at || ''
        return true
      } catch (e) {
        console.error('Failed to load draft:', e)
      }
    }
  }
  return false
}

const saveDraft = () => {
  if (process.client) {
    const data = {
      ...form.value,
      savedAt: new Date().toISOString()
    }
    localStorage.setItem(getDraftKey(), JSON.stringify(data))
    draftSaved.value = true
    setTimeout(() => { draftSaved.value = false }, 2000)
  }
}

const clearDraft = () => {
  if (process.client) {
    localStorage.removeItem(getDraftKey())
  }
}

const loadPost = async () => {
  loading.value = true
  error.value = null
  try {
    // Check if there's a draft first
    if (process.client) {
      const saved = localStorage.getItem(getDraftKey())
      if (saved) {
        const useDraft = confirm('You have unsaved changes. Do you want to restore them?')
        if (useDraft) {
          loadDraft()
          loading.value = false
          return
        } else {
          clearDraft()
        }
      }
    }

    const response = await fetchBlogPost(postId.value)
    const post = response.post

    form.value = {
      title: post.title || '',
      subtitle: post.subtitle || '',
      slug: post.slug || '',
      content: post.content || '',
      status: post.status || 'draft',
      tags: post.tags || [],
      category_id: post.category_id || '',
      published_at: post.published_at ? formatDateTimeLocal(post.published_at) : ''
    }
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to load blog post'
  } finally {
    loading.value = false
  }
}

const formatDateTimeLocal = (dateStr: string) => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag)
    tagInput.value = ''
  }
}

const removeTag = (index: number) => {
  form.value.tags.splice(index, 1)
}

const goToStep2 = () => {
  if (!canProceed.value) {
    error.value = 'Please fill in all required fields'
    return
  }
  error.value = null
  step.value = 2
}

const saveBasicInfo = async () => {
  error.value = null
  submitting.value = true

  try {
    const data = {
      title: form.value.title.trim(),
      subtitle: form.value.subtitle.trim() || undefined,
      slug: form.value.slug.trim(),
      status: form.value.status,
      tags: form.value.tags.length > 0 ? form.value.tags : undefined,
      category_id: form.value.category_id.trim() || undefined,
      published_at: form.value.published_at || undefined
    }

    await updateBlogPost(postId.value, data)
    clearDraft()
    alert('Basic information saved successfully!')
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to save blog post'
  } finally {
    submitting.value = false
  }
}

const handleSubmit = async () => {
  error.value = null
  submitting.value = true

  try {
    const data = {
      title: form.value.title.trim(),
      subtitle: form.value.subtitle.trim() || undefined,
      slug: form.value.slug.trim(),
      content: form.value.content,
      status: form.value.status,
      tags: form.value.tags.length > 0 ? form.value.tags : undefined,
      category_id: form.value.category_id.trim() || undefined,
      published_at: form.value.published_at || undefined
    }

    await updateBlogPost(postId.value, data)
    clearDraft()
    navigateTo('/admin/blog')
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to update blog post'
    submitting.value = false
  }
}

onMounted(() => {
  loadPost()
  if (step.value === 2 && typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})

watch(step, (newStep) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = newStep === 2 ? 'hidden' : ''
  }
  if (newStep === 2) {
    nextTick(() => {
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0)
      }
    })
  }
})
</script>

<style scoped>
.edit-blog-page {
  min-height: 100vh;
  background: var(--color-bg);
}

.page-header {
  background: var(--color-white);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-xl) var(--spacing-2xl);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-muted);
  text-decoration: none;
  font-size: var(--text-sm);
  margin-bottom: var(--spacing-md);
  transition: color var(--transition-fast);
}

.back-link:hover {
  color: var(--color-text);
}

.page-header h1 {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.loading {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-muted);
}

.error-banner {
  background: #fee;
  color: #c00;
  padding: var(--spacing-md) var(--spacing-2xl);
  border-bottom: 1px solid #fcc;
}

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  background: var(--color-white);
  border-bottom: 1px solid var(--color-border);
}

.step {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-muted);
  font-size: var(--text-sm);
  font-weight: 600;
}

.step.active {
  color: var(--color-text);
}

.step.completed .step-number {
  background: var(--color-text);
  color: var(--color-white);
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.step.active .step-number {
  border-color: var(--color-text);
  background: var(--color-text);
  color: var(--color-white);
}

.step-divider {
  width: 80px;
  height: 2px;
  background: var(--color-border);
  margin: 0 var(--spacing-md);
}

.step-content {
  padding: var(--spacing-2xl);
  max-width: 800px;
  margin: 0 auto;
}

.step-content.full-height {
  max-width: none;
  padding: 0;
  height: calc(100vh - 200px);
}

.form-section {
  background: var(--color-white);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text);
  font-size: var(--text-sm);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-text);
}

.form-group small {
  display: block;
  margin-top: var(--spacing-xs);
  font-size: var(--text-xs);
  color: var(--color-muted);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

.tags-input {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 4px 8px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
}

.tag button {
  background: none;
  border: none;
  color: var(--color-muted);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
}

.tag button:hover {
  color: var(--color-text);
}

.tags-input input {
  border: none;
  padding: var(--spacing-xs);
  font-size: var(--text-sm);
}

.tags-input input:focus {
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--color-border);
}

.btn-save {
  padding: var(--spacing-sm) var(--spacing-xl);
  background: #28a745;
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-save:hover:not(:disabled) {
  background: #218838;
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-next {
  padding: var(--spacing-sm) var(--spacing-xl);
  background: var(--color-text);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-next:hover:not(:disabled) {
  background: var(--color-accent);
}

.btn-next:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.editor-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--color-white);
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-2xl);
  border-bottom: 1px solid var(--color-border);
}

.editor-header h2 {
  font-size: var(--text-lg);
  font-weight: 700;
  margin: 0;
}

.editor-actions {
  display: flex;
  gap: var(--spacing-md);
}

.btn-back {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-back:hover {
  border-color: var(--color-text);
}

.btn-draft {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-draft:hover:not(:disabled) {
  border-color: var(--color-text);
}

.btn-draft.saved {
  background: #4caf50;
  border-color: #4caf50;
  color: white;
}

.btn-submit {
  padding: var(--spacing-sm) var(--spacing-xl);
  background: #28a745;
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-submit:hover:not(:disabled) {
  background: #218838;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .step-content {
    padding: var(--spacing-lg);
  }

  .form-section {
    padding: var(--spacing-lg);
  }
}
</style>
