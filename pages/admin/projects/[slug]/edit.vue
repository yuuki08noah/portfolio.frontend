<template>
  <div class="project-edit-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading project...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="loadError" class="error-container">
      <p class="error-text">{{ loadError }}</p>
      <NuxtLink to="/admin/projects" class="btn-back">← Back to Projects</NuxtLink>
    </div>

    <!-- Step 1: Basic Info -->
    <div v-else-if="step === 1" class="step-one">
      <div class="step-container">
        <header class="step-header">
          <NuxtLink to="/admin/projects" class="back-link">← Back to Projects</NuxtLink>
          <h1 class="step-title">Edit Project</h1>
          <p class="step-subtitle">Step 1 of 2: Basic Information</p>
        </header>

        <form @submit.prevent="saveBasicInfo" class="info-form">
          <div v-if="error" class="error-message">{{ error }}</div>

          <div class="form-grid">
            <div class="form-field full-width">
              <label for="title">Project Title *</label>
              <input id="title" v-model="form.title" type="text" required maxlength="100" placeholder="Enter project title" />
            </div>

            <div class="form-field full-width">
              <label for="description">Description *</label>
              <textarea id="description" v-model="form.description" required maxlength="1000" rows="3" placeholder="Brief description shown on project card"></textarea>
              <span class="char-count">{{ form.description.length }}/1000</span>
            </div>

            <div class="form-field full-width">
              <label>Tech Stack *</label>
              <div class="tags-input">
                <div class="tags-list">
                  <span v-for="(tech, idx) in form.stack" :key="idx" class="tag">
                    {{ tech }}
                    <button type="button" class="tag-remove" @click="removeStack(idx)">×</button>
                  </span>
                </div>
                <input v-model="newStack" type="text" placeholder="Add technology and press Enter" @keydown.enter.prevent="addStack" />
              </div>
            </div>

            <div class="form-field">
              <label for="start_date">Start Date</label>
              <input id="start_date" v-model="form.start_date" type="date" />
            </div>

            <div class="form-field">
              <label for="end_date">End Date</label>
              <input id="end_date" v-model="form.end_date" type="date" :disabled="form.is_ongoing" />
            </div>

            <div class="form-field">
              <label for="demo_url">Demo URL</label>
              <input id="demo_url" v-model="form.demo_url" type="url" placeholder="https://demo.com" />
            </div>

            <div class="form-field">
              <label for="repo_url">Repository URL</label>
              <input id="repo_url" v-model="form.repo_url" type="url" placeholder="https://github.com/user/repo" />
            </div>

            <div class="form-field full-width checkbox-field">
              <label class="checkbox-label">
                <input type="checkbox" v-model="form.is_ongoing" />
                <span>Currently ongoing (In Progress)</span>
              </label>
            </div>
          </div>

          <div class="form-actions">
            <NuxtLink to="/admin/projects" class="btn-cancel">Cancel</NuxtLink>
            <button type="submit" class="btn-save" :disabled="submitting">
              {{ submitting ? 'Saving...' : 'Save Changes' }}
            </button>
            <button type="button" class="btn-next" @click="goToStep2">Next: Edit Content →</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Step 2: Editor -->
    <div v-else class="step-two">
      <header class="top-bar">
        <div class="top-bar-inner">
          <button type="button" class="back-btn" @click="step = 1">
            <span class="back-icon">←</span>
            <span class="back-text">Back to Info</span>
          </button>

          <div class="project-info">
            <span class="project-title">{{ form.title }}</span>
            <span class="step-indicator">Step 2 of 2</span>
          </div>

          <div class="top-bar-actions">
            <button type="button" class="btn-draft" :class="{ saved: draftSaved }" :disabled="submitting" @click="saveDraft">
              {{ draftSaved ? 'Saved!' : 'Save Draft' }}
            </button>
            <button type="button" class="btn-publish" :disabled="submitting" @click="handleSubmit">
              {{ submitting ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </header>

      <div class="editor-layout">
        <div class="editor-pane">
          <div class="editor-inner">
            <h2 class="editor-heading">Project Overview</h2>
            <div class="editor-divider"></div>

            <!-- New Markdown Editor Component -->
            <MarkdownEditor v-model="form.overview_content" />
          </div>
        </div>

        <div class="preview-pane">
          <div class="preview-inner">
            <article class="preview-article">
              <h1 class="preview-title">{{ form.title }}</h1>
              <p class="preview-description">{{ form.description }}</p>
              <div class="preview-stack">
                <span v-for="tech in form.stack" :key="tech" class="stack-tag">{{ tech }}</span>
              </div>
              <div class="preview-content">
                <MarkdownRenderer :content="form.overview_content" />
              </div>
              <p v-if="!form.overview_content" class="preview-placeholder">Your project content will appear here...</p>
            </article>
          </div>
        </div>
      </div>

      <div v-if="error" class="error-toast">
        {{ error }}
        <button @click="error = null">×</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { marked } from 'marked'
import MarkdownEditor from '~/components/admin/MarkdownEditor.vue'
import MarkdownRenderer from '~/components/blog/MarkdownRenderer.vue'

definePageMeta({
  middleware: ['admin'],
  layout: false,
  ssr: true
})

const route = useRoute()
const router = useRouter()
const slug = computed(() => route.params.slug as string)

const { fetchProject, updateProject, fetchProjectDocs, updateProjectDoc } = useProjects()

const step = ref(1)
const loading = ref(true)
const loadError = ref<string | null>(null)
const form = reactive({
  title: '',
  description: '',
  start_date: '',
  end_date: '',
  is_ongoing: false,
  stack: [] as string[],
  demo_url: '',
  repo_url: '',
  overview_content: ''
})
const overviewDocId = ref<string | null>(null)

const newStack = ref('')
const error = ref<string | null>(null)
const submitting = ref(false)
const draftSaved = ref(false)

const getDraftKey = () => `project_draft_edit_${slug.value}`

const loadDraft = () => {
  if (process.client) {
    const saved = localStorage.getItem(getDraftKey())
    if (saved) {
      try {
        const data = JSON.parse(saved)
        form.title = data.title || ''
        form.description = data.description || ''
        form.start_date = data.start_date || ''
        form.end_date = data.end_date || ''
        form.is_ongoing = data.is_ongoing || false
        form.stack = Array.isArray(data.stack) ? data.stack : []
        form.demo_url = data.demo_url || ''
        form.repo_url = data.repo_url || ''
        form.overview_content = data.overview_content || ''
        return true
      } catch (e) {
        console.error('Failed to load draft:', e)
      }
    }
  }
  return false
}

const clearDraft = () => {
  if (process.client) {
    localStorage.removeItem(getDraftKey())
  }
}

// Load project data
const loadProject = async () => {
  loading.value = true
  loadError.value = null

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

    const [projectResponse, docsResponse] = await Promise.all([
      fetchProject(slug.value),
      fetchProjectDocs(slug.value)
    ])

    const project = projectResponse.project
    form.title = project.title || ''
    form.description = project.description || ''
    form.start_date = project.start_date || ''
    form.end_date = project.end_date || ''
    form.is_ongoing = project.is_ongoing || false
    form.stack = Array.isArray(project.stack) ? project.stack : []
    form.demo_url = project.links?.demo || ''
    form.repo_url = project.links?.repo || ''

    // Load overview doc
    const overviewDoc = docsResponse.docs?.find((d: any) => d.category === 'overview')
    if (overviewDoc) {
      form.overview_content = overviewDoc.content || ''
      overviewDocId.value = overviewDoc.id
    }
  } catch (e: any) {
    loadError.value = e.data?.message || 'Failed to load project'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProject()
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

const addStack = () => {
  const tech = newStack.value.trim()
  if (tech && !form.stack.includes(tech)) {
    form.stack.push(tech)
    newStack.value = ''
  }
}

const removeStack = (idx: number) => {
  form.stack.splice(idx, 1)
}

const goToStep2 = () => {
  error.value = null
  if (!form.title.trim()) { error.value = 'Title is required'; return }
  if (!form.description.trim()) { error.value = 'Description is required'; return }
  if (form.stack.length === 0) { error.value = 'At least one technology is required'; return }
  step.value = 2
}

const saveDraft = () => {
  if (process.client) {
    const data = {
      title: form.title,
      description: form.description,
      start_date: form.start_date,
      end_date: form.end_date,
      is_ongoing: form.is_ongoing,
      stack: form.stack,
      demo_url: form.demo_url,
      repo_url: form.repo_url,
      overview_content: form.overview_content,
      savedAt: new Date().toISOString()
    }
    localStorage.setItem(getDraftKey(), JSON.stringify(data))
    draftSaved.value = true
    setTimeout(() => { draftSaved.value = false }, 2000)
  }
}

// Save basic info only (Step 1)
const saveBasicInfo = async () => {
  error.value = null
  submitting.value = true

  try {
    const data = {
      title: form.title.trim(),
      description: form.description.trim(),
      stack: form.stack,
      demo_url: form.demo_url.trim() || undefined,
      repo_url: form.repo_url.trim() || undefined,
      start_date: form.start_date || undefined,
      end_date: form.is_ongoing ? undefined : (form.end_date || undefined),
      is_ongoing: form.is_ongoing
    }

    await updateProject(slug.value, data)
    error.value = null
    alert('Basic information saved successfully!')
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to save project'
  } finally {
    submitting.value = false
  }
}

// Save everything (Step 2)
const handleSubmit = async () => {
  error.value = null
  submitting.value = true

  try {
    const data = {
      title: form.title.trim(),
      description: form.description.trim(),
      stack: form.stack,
      demo_url: form.demo_url.trim() || undefined,
      repo_url: form.repo_url.trim() || undefined,
      start_date: form.start_date || undefined,
      end_date: form.is_ongoing ? undefined : (form.end_date || undefined),
      is_ongoing: form.is_ongoing
    }

    await updateProject(slug.value, data)

    // Update overview doc if exists
    if (overviewDocId.value && form.overview_content.trim()) {
      await updateProjectDoc(slug.value, 'overview', 'overview', {
        content: form.overview_content.trim()
      })
    }

    clearDraft()
    router.push('/admin/projects')
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to update project'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.project-edit-page {
  min-height: 100vh;
  background: #fafafa;
}

/* Loading & Error */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top-color: #111;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-text {
  color: #d32f2f;
  font-size: 1rem;
}

.btn-back {
  padding: 10px 20px;
  background: #111;
  color: #fff;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: opacity 0.2s;
}

.btn-back:hover {
  opacity: 0.8;
}

/* Step 1: Info Form */
.step-one {
  padding: 40px 20px 80px;
}

.step-container {
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  padding: 48px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.step-header {
  margin-bottom: 40px;
}

.back-link {
  display: inline-block;
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 16px;
  transition: color 0.2s;
}

.back-link:hover {
  color: #111;
}

.step-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 8px;
  color: #111;
}

.step-subtitle {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
}

.info-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.error-message {
  padding: 12px 16px;
  background: #fee;
  border-left: 3px solid #d32f2f;
  color: #d32f2f;
  border-radius: 4px;
  font-size: 0.9rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.form-field label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
}

.form-field input,
.form-field textarea {
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: 'Inter', sans-serif;
  transition: border-color 0.2s;
}

.form-field input:focus,
.form-field textarea:focus {
  outline: none;
  border-color: #111;
}

.char-count {
  font-size: 0.8rem;
  color: #999;
  text-align: right;
}

.tags-input {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fafafa;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #111;
  color: #fff;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
}

.tag-remove {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  padding: 0;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.tag-remove:hover {
  opacity: 1;
}

.tags-input input {
  border: none;
  background: none;
  font-size: 0.9rem;
  padding: 6px 0;
}

.tags-input input:focus {
  outline: none;
}

.checkbox-field {
  padding-top: 10px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-weight: 500;
  color: #333;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn-cancel,
.btn-save,
.btn-next {
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  border: none;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-cancel:hover {
  background: #eee;
  color: #333;
}

.btn-save {
  background: #4caf50;
  color: #fff;
}

.btn-save:hover:not(:disabled) {
  background: #45a049;
}

.btn-next {
  background: #111;
  color: #fff;
}

.btn-next:hover {
  background: #333;
}

.btn-save:disabled,
.btn-next:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Step 2: Editor */
.step-two {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #faf9f6;
}

.top-bar {
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.top-bar-inner {
  max-width: 1800px;
  margin: 0 auto;
  padding: 0 80px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  background: transparent;
  border: none;
  color: #666;
  font-family: var(--font-body);
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s;
}

.back-btn:hover {
  color: #111;
}

.back-icon {
  font-size: 16px;
}

.project-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.project-title {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  color: #111;
}

.step-indicator {
  font-family: var(--font-body);
  font-size: 12px;
  color: #999;
}

.top-bar-actions {
  display: flex;
  gap: 12px;
}

.btn-draft {
  padding: 10px 20px;
  background: transparent;
  border: 1px solid #ccc;
  color: #333;
  font-family: var(--font-body);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-draft:hover:not(:disabled) {
  border-color: #111;
  color: #111;
}

.btn-draft.saved {
  background: #4caf50;
  border-color: #4caf50;
  color: #fff;
}

.btn-publish {
  padding: 10px 24px;
  background: #111;
  border: 1px solid #111;
  color: #fff;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-publish:hover:not(:disabled) {
  background: #333;
}

.btn-draft:disabled,
.btn-publish:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.editor-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  margin: 0 80px;
}

.editor-pane {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  background: #fff;
  border-right: 1px solid #e0e0e0;
}

.preview-pane {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  background: #fff;
}

.editor-inner {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 32px 40px;
  overflow-y: auto;
}

.preview-inner {
  flex: 1;
  min-height: 0;
  padding: 32px 40px;
  overflow-y: auto;
}

.editor-heading {
  font-family: 'Playfair Display', 'NanumSquare_ac', 'NanumSquare', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 16px;
}

.editor-divider {
  width: 60px;
  height: 3px;
  background: #111;
  margin-bottom: 24px;
}

.preview-article {
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.preview-title {
  font-family: 'Playfair Display', 'NanumSquare_ac', 'NanumSquare', serif;
  font-size: 2rem;
  font-weight: 700;
  color: #111;
  line-height: 1.2;
  margin: 0 0 16px;
}

.preview-description {
  font-family: var(--font-body);
  font-size: 18px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 20px;
}

.preview-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e0e0e0;
}

.stack-tag {
  padding: 4px 12px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  font-family: var(--font-body);
  font-size: 13px;
  color: #333;
}

.preview-placeholder {
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 60px 20px;
  font-family: var(--font-body);
}

.error-toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #d32f2f;
  color: #fff;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 400px;
  font-family: var(--font-body);
}

.error-toast button {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

@media (max-width: 1200px) {
  .editor-layout {
    grid-template-columns: 1fr;
    margin: 0 20px;
  }

  .preview-pane {
    display: none;
  }
}

@media (max-width: 768px) {
  .step-container {
    padding: 32px 24px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-save,
  .btn-next {
    width: 100%;
  }

  .top-bar-inner {
    padding: 0 20px;
  }
}
</style>
