<template>
  <div class="project-create-page">
    <!-- Step 1: Basic Info -->
    <div v-if="step === 1" class="step-one">
      <div class="step-container">
        <header class="step-header">
          <NuxtLink to="/admin/projects" class="back-link">← Back to Projects</NuxtLink>
          <h1 class="step-title">New Project</h1>
          <p class="step-subtitle">Step 1 of 2: Basic Information</p>
        </header>

        <form @submit.prevent="goToStep2" class="info-form">
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
            <button type="submit" class="btn-next">Next: Write Content →</button>
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
              {{ submitting ? 'Creating...' : 'Create Project' }}
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
  layout: false
})

const router = useRouter()
const { createProject, createProjectDoc } = useProjects()

const step = ref(1)
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

const newStack = ref('')
const error = ref<string | null>(null)
const submitting = ref(false)
const draftSaved = ref(false)

const DRAFT_KEY = 'project_draft_new'

const loadDraft = () => {
  if (process.client) {
    const saved = localStorage.getItem(DRAFT_KEY)
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
    localStorage.removeItem(DRAFT_KEY)
  }
}

onMounted(() => {
  loadDraft()
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
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data))
    draftSaved.value = true
    setTimeout(() => { draftSaved.value = false }, 2000)
  }
}

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

    const response = await createProject(data)
    const projectSlug = response.project.slug

    if (form.overview_content.trim()) {
      try {
        await createProjectDoc(projectSlug, {
          title: form.title.trim(),
          category: 'overview',
          content: form.overview_content.trim(),
          order: 0
        })
      } catch (docError) {
        console.error('Failed to create overview document:', docError)
      }
    }

    clearDraft()
    router.push(`/projects/${projectSlug}`)
  } catch (e: any) {
    error.value = e.data?.error?.message || e.data?.message || 'Failed to create project'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* Step 1 */
.step-one {
  min-height: 100vh;
  background: #faf9f6;
  padding: 60px 20px;
}

.step-container {
  max-width: 800px;
  margin: 0 auto;
}

.step-header {
  margin-bottom: 40px;
}

.back-link {
  display: inline-block;
  margin-bottom: 16px;
  font-size: 14px;
  color: #666;
  text-decoration: none;
  font-family: 'Georgia', serif;
}

.back-link:hover {
  color: #111;
}

.step-title {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 8px;
  color: #111;
}

.step-subtitle {
  font-family: 'Georgia', serif;
  font-size: 16px;
  color: #666;
  margin: 0;
}

.info-form {
  background: #fff;
  padding: 40px;
  border: 1px solid #e0e0e0;
}

.error-message {
  padding: 16px;
  background: #ffebee;
  border: 1px solid #ef9a9a;
  color: #c62828;
  margin-bottom: 24px;
  font-family: 'Georgia', serif;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
  font-family: 'Georgia', serif;
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.form-field input,
.form-field textarea {
  padding: 12px 14px;
  border: 1px solid #e0e0e0;
  font-size: 16px;
  font-family: 'Georgia', serif;
  transition: border-color 0.2s;
}

.form-field input:focus,
.form-field textarea:focus {
  outline: none;
  border-color: #111;
}

.form-field input:disabled {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.char-count {
  font-size: 12px;
  color: #999;
  text-align: right;
  font-family: 'Georgia', serif;
}

.tags-input {
  border: 1px solid #e0e0e0;
  padding: 12px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  font-family: 'Georgia', serif;
  font-size: 14px;
  color: #333;
}

.tag-remove {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 16px;
  line-height: 1;
  color: #999;
}

.tag-remove:hover {
  color: #c62828;
}

.tags-input input {
  width: 100%;
  padding: 8px 0;
  border: none;
  outline: none;
  font-size: 16px;
  font-family: 'Georgia', serif;
}

.checkbox-field {
  padding-top: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-weight: normal;
  font-family: 'Georgia', serif;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
}

.btn-cancel {
  padding: 12px 24px;
  background: transparent;
  border: 1px solid #ccc;
  text-decoration: none;
  color: #333;
  font-family: 'Georgia', serif;
  font-size: 14px;
  cursor: pointer;
}

.btn-cancel:hover {
  border-color: #111;
}

.btn-next {
  padding: 12px 28px;
  background: #111;
  border: 1px solid #111;
  color: #fff;
  font-family: 'Georgia', serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-next:hover {
  background: #333;
}

/* Step 2 */
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
  font-family: 'Georgia', serif;
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
  font-family: 'Georgia', serif;
  font-size: 14px;
  font-weight: 600;
  color: #111;
}

.step-indicator {
  font-family: 'Georgia', serif;
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
  font-family: 'Georgia', serif;
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
  font-family: 'Georgia', serif;
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
  font-family: 'Playfair Display', 'Georgia', serif;
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
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: 2rem;
  font-weight: 700;
  color: #111;
  line-height: 1.2;
  margin: 0 0 16px;
}

.preview-description {
  font-family: 'Georgia', serif;
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
  font-family: 'Georgia', serif;
  font-size: 13px;
  color: #333;
}
</style>
