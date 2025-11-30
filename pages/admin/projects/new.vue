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
            <button type="button" class="btn-draft" :disabled="submitting" @click="saveDraft">Save Draft</button>
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

            <div class="editor-toolbar">
              <button type="button" class="toolbar-btn" title="Heading 1" @click="insertMarkdown('# ')">H<sub>1</sub></button>
              <button type="button" class="toolbar-btn" title="Heading 2" @click="insertMarkdown('## ')">H<sub>2</sub></button>
              <button type="button" class="toolbar-btn" title="Heading 3" @click="insertMarkdown('### ')">H<sub>3</sub></button>
              <span class="toolbar-divider"></span>
              <button type="button" class="toolbar-btn" title="Bold" @click="wrapSelection('**')"><strong>B</strong></button>
              <button type="button" class="toolbar-btn" title="Italic" @click="wrapSelection('*')"><em>I</em></button>
              <button type="button" class="toolbar-btn" title="Strike" @click="wrapSelection('~~')"><s>S</s></button>
              <span class="toolbar-divider"></span>
              <button type="button" class="toolbar-btn" title="Quote" @click="insertMarkdown('> ')">❝</button>
              <button type="button" class="toolbar-btn" title="Link" @click="insertLink">🔗</button>
              <button type="button" class="toolbar-btn" title="Code" @click="insertCodeBlock">&lt;/&gt;</button>
            </div>

            <textarea
              ref="editorRef"
              v-model="form.overview_content"
              class="markdown-editor"
              placeholder="Describe your project in detail using Markdown..."
              @keydown.tab.prevent="handleTab"
            ></textarea>
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
              <div class="preview-content" v-html="renderedMarkdown"></div>
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
const editorRef = ref<HTMLTextAreaElement | null>(null)

onMounted(() => {
  if (step.value === 2) {
    document.body.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})

watch(step, (newStep) => {
  document.body.style.overflow = newStep === 2 ? 'hidden' : ''
})

const renderedMarkdown = computed(() => {
  if (!form.overview_content) return ''
  try {
    return marked(form.overview_content)
  } catch (e) {
    return '<p class="error-preview">Invalid markdown</p>'
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

const handleTab = (e: KeyboardEvent) => {
  const textarea = e.target as HTMLTextAreaElement
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  form.overview_content = form.overview_content.substring(0, start) + '  ' + form.overview_content.substring(end)
  nextTick(() => { textarea.selectionStart = textarea.selectionEnd = start + 2 })
}

const insertMarkdown = (prefix: string) => {
  const textarea = editorRef.value
  if (!textarea) return
  const start = textarea.selectionStart
  form.overview_content = form.overview_content.substring(0, start) + prefix + form.overview_content.substring(start)
  nextTick(() => {
    textarea.focus()
    textarea.selectionStart = textarea.selectionEnd = start + prefix.length
  })
}

const wrapSelection = (wrapper: string) => {
  const textarea = editorRef.value
  if (!textarea) return
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selected = form.overview_content.substring(start, end)
  form.overview_content = form.overview_content.substring(0, start) + wrapper + selected + wrapper + form.overview_content.substring(end)
  nextTick(() => {
    textarea.focus()
    textarea.selectionStart = start + wrapper.length
    textarea.selectionEnd = end + wrapper.length
  })
}

const insertLink = () => {
  const url = prompt('Enter URL:')
  if (url) insertMarkdown(`[link text](${url})`)
}

const insertCodeBlock = () => {
  insertMarkdown('```\ncode here\n```')
}

const saveDraft = async () => {
  alert('Draft saving not implemented yet')
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

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.toolbar-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  color: #666;
  font-family: 'Georgia', serif;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
}

.toolbar-btn:hover {
  background: #f5f5f5;
  border-color: #e0e0e0;
  color: #111;
}

.toolbar-btn sub {
  font-size: 10px;
  margin-left: 1px;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background: #e0e0e0;
  margin: 0 8px;
}

.markdown-editor {
  flex: 1;
  width: 100%;
  min-height: 200px;
  padding: 0;
  border: none;
  font-family: 'Georgia', serif;
  font-size: 17px;
  line-height: 1.8;
  color: #333;
  background: transparent;
  resize: none;
}

.markdown-editor:focus {
  outline: none;
}

.markdown-editor::placeholder {
  color: #999;
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

.preview-content {
  font-family: 'Georgia', serif;
  font-size: 18px;
  line-height: 1.9;
  color: #333;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.preview-placeholder {
  color: #999;
  font-style: italic;
}

.preview-content :deep(h1) {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 40px 0 16px;
  color: #111;
}

.preview-content :deep(h2) {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 32px 0 12px;
  color: #111;
}

.preview-content :deep(h3) {
  font-family: 'Georgia', serif;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 24px 0 8px;
  color: #111;
}

.preview-content :deep(p) {
  margin: 0 0 20px;
}

.preview-content :deep(a) {
  color: #326891;
  text-decoration: underline;
}

.preview-content :deep(blockquote) {
  margin: 24px 0;
  padding: 0 0 0 20px;
  border-left: 3px solid #111;
  font-style: italic;
  color: #555;
}

.preview-content :deep(code) {
  padding: 2px 6px;
  background: #f5f5f5;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 0.9em;
}

.preview-content :deep(pre) {
  margin: 20px 0;
  padding: 16px;
  background: #f5f5f5;
  overflow-x: auto;
}

.preview-content :deep(pre code) {
  padding: 0;
  background: transparent;
}

.error-toast {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: #111;
  color: #fff;
  font-family: 'Georgia', serif;
  font-size: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  z-index: 200;
}

.error-toast button {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 18px;
  opacity: 0.7;
}

.error-toast button:hover {
  opacity: 1;
}

@media (max-width: 1200px) {
  .top-bar-inner { padding: 0 40px; }
  .editor-layout { margin: 0 40px; }
}

@media (max-width: 1024px) {
  .editor-layout { grid-template-columns: 1fr; }
  .preview-pane { display: none; }
  .editor-pane { border-right: none; }
}

@media (max-width: 768px) {
  .step-one { padding: 40px 20px; }
  .info-form { padding: 24px; }
  .form-grid { grid-template-columns: 1fr; }
  .form-actions { flex-direction: column; }
  .btn-cancel, .btn-next { width: 100%; text-align: center; }
  .top-bar-inner { padding: 0 20px; }
  .editor-layout { margin: 0; }
  .project-info { display: none; }
  .back-text { display: none; }
}
</style>
