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

          <div class="lang-tabs">
            <button 
              type="button" 
              class="lang-tab" 
              :class="{ active: activeLang === 'en' }" 
              @click="activeLang = 'en'"
            >
              English (Default)
            </button>
            <button 
              type="button" 
              class="lang-tab" 
              :class="{ active: activeLang === 'ko' }" 
              @click="activeLang = 'ko'"
            >
              Korean
            </button>
            <button 
              type="button" 
              class="lang-tab" 
              :class="{ active: activeLang === 'ja' }" 
              @click="activeLang = 'ja'"
            >
              Japanese
            </button>
          </div>

          <div class="form-grid">
            <!-- English Title/Desc -->
            <template v-if="activeLang === 'en'">
              <div class="form-field full-width">
                <label for="title">Project Title (English) *</label>
                <input id="title" v-model="form.title" type="text" required maxlength="100" placeholder="Enter project title" />
              </div>

              <div class="form-field full-width">
                <label for="description">Description (English) *</label>
                <textarea id="description" v-model="form.description" required maxlength="1000" rows="3" placeholder="Brief description shown on project card"></textarea>
                <span class="char-count">{{ form.description.length }}/1000</span>
              </div>
            </template>

            <!-- Korean Title/Desc -->
            <template v-if="activeLang === 'ko'">
              <div class="form-field full-width">
                <label for="title_ko">Project Title (Korean)</label>
                <input id="title_ko" v-model="form.translations.ko.title" type="text" maxlength="100" placeholder="Enter Korean title" />
              </div>

              <div class="form-field full-width">
                <label for="description_ko">Description (Korean)</label>
                <textarea id="description_ko" v-model="form.translations.ko.description" maxlength="1000" rows="3" placeholder="Enter Korean description"></textarea>
                <span class="char-count">{{ form.translations.ko.description.length }}/1000</span>
              </div>
            </template>

            <!-- Japanese Title/Desc -->
            <template v-if="activeLang === 'ja'">
              <div class="form-field full-width">
                <label for="title_ja">Project Title (Japanese)</label>
                <input id="title_ja" v-model="form.translations.ja.title" type="text" maxlength="100" placeholder="Enter Japanese title" />
              </div>

              <div class="form-field full-width">
                <label for="description_ja">Description (Japanese)</label>
                <textarea id="description_ja" v-model="form.translations.ja.description" maxlength="1000" rows="3" placeholder="Enter Japanese description"></textarea>
                <span class="char-count">{{ form.translations.ja.description.length }}/1000</span>
              </div>
            </template>

            <div class="form-field full-width">
              <label>Banner Image</label>
              <div class="banner-upload">
                <div v-if="form.cover_image" class="banner-preview">
                  <img :src="form.cover_image" alt="Banner preview" />
                  <button type="button" class="banner-remove" @click="form.cover_image = ''">×</button>
                </div>
                <div v-else class="banner-placeholder">
                  <span>No banner image</span>
                </div>
                <div class="banner-actions">
                  <input
                    ref="bannerInput"
                    type="file"
                    accept="image/*"
                    style="display: none"
                    @change="handleBannerUpload"
                  />
                  <button type="button" class="btn-upload" @click="($refs.bannerInput as HTMLInputElement)?.click()" :disabled="uploadingBanner">
                    {{ uploadingBanner ? 'Uploading...' : 'Upload Image' }}
                  </button>
                  <span class="banner-hint">or paste image URL below</span>
                  <input
                    v-model="form.cover_image"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    class="banner-url-input"
                  />
                </div>
              </div>
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

      <div class="editor-container">
        <MarkdownEditor v-model="form.overview_content" />
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

const activeLang = ref<'en' | 'ko' | 'ja'>('en')

const form = reactive({
  title: '',
  description: '',
  cover_image: '',
  start_date: '',
  end_date: '',
  is_ongoing: false,
  stack: [] as string[],
  demo_url: '',
  repo_url: '',
  overview_content: '',
  translations: {
    ko: { title: '', description: '' },
    ja: { title: '', description: '' }
  }
})

const overviewDocId = ref<string | null>(null)
const bannerInput = ref<HTMLInputElement | null>(null)
const uploadingBanner = ref(false)
const newStack = ref('')
const error = ref<string | null>(null)
const submitting = ref(false)
const draftSaved = ref(false)

const getDraftKey = () => `project_draft_edit_${slug.value}`

// ...

const loadDraft = () => {
  if (process.client) {
    const saved = localStorage.getItem(getDraftKey())
    if (saved) {
      try {
        const data = JSON.parse(saved)
        // ... load data logic ...
        form.title = data.title || ''
        form.description = data.description || ''
        form.start_date = data.start_date || ''
        form.end_date = data.end_date || ''
        form.is_ongoing = data.is_ongoing || false
        form.stack = Array.isArray(data.stack) ? data.stack : []
        form.demo_url = data.demo_url || ''
        form.repo_url = data.repo_url || ''
        form.overview_content = data.overview_content || ''
        if (data.translations) {
            form.translations = data.translations
        } else {
             form.translations = {
                ko: { title: '', description: '' },
                ja: { title: '', description: '' }
             }
        }
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
    form.cover_image = project.coverImage || ''
    form.start_date = project.start_date || ''
    form.end_date = project.end_date || ''
    form.is_ongoing = project.is_ongoing || false
    form.stack = Array.isArray(project.stack) ? project.stack : []
    form.demo_url = project.links?.demo || ''
    form.repo_url = project.links?.repo || ''
    
    // Load translations
    if (project.translations) {
      form.translations = {
        ko: { 
          title: project.translations.ko?.title || '', 
          description: project.translations.ko?.description || '' 
        },
        ja: { 
          title: project.translations.ja?.title || '', 
          description: project.translations.ja?.description || '' 
        }
      }
    }

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

const addStack = () => {
  if (newStack.value.trim()) {
    form.stack.push(newStack.value.trim())
    newStack.value = ''
  }
}

const removeStack = (idx: number) => {
  form.stack.splice(idx, 1)
}

const goToStep2 = () => {
  if (!form.title || !form.description) {
    error.value = 'Title and description are required.'
    return
  }
  step.value = 2
}

const handleBannerUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  
  uploadingBanner.value = true
  try {
    const file = input.files[0]
    const formData = new FormData()
    formData.append('file', file)
    
    const token = useCookie<string>('auth_token').value || ''
    const config = useRuntimeConfig()
    
    const response = await $fetch<{ url: string }>('/api/v1/uploads', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    form.cover_image = response.url
  } catch (e: any) {
    error.value = 'Failed to upload banner: ' + (e.message || 'Unknown error')
  } finally {
    uploadingBanner.value = false
    if (bannerInput.value) bannerInput.value.value = ''
  }
}

const saveDraft = () => {
  if (process.client) {
    const data = {
      title: form.title,
      description: form.description,
      cover_image: form.cover_image,
      start_date: form.start_date,
      end_date: form.end_date,
      is_ongoing: form.is_ongoing,
      stack: form.stack,
      demo_url: form.demo_url,
      repo_url: form.repo_url,
      overview_content: form.overview_content,
      translations: form.translations,
      savedAt: new Date().toISOString()
    }
    localStorage.setItem(getDraftKey(), JSON.stringify(data))
    draftSaved.value = true
    setTimeout(() => { draftSaved.value = false }, 2000)
  }
}

// ...

// Save basic info only (Step 1)
const saveBasicInfo = async () => {
  error.value = null
  submitting.value = true

  try {
    const data = {
      title: form.title.trim(),
      description: form.description.trim(),
      cover_image: form.cover_image.trim() || undefined,
      stack: form.stack,
      demo_url: form.demo_url.trim() || undefined,
      repo_url: form.repo_url.trim() || undefined,
      start_date: form.start_date || undefined,
      end_date: form.is_ongoing ? undefined : (form.end_date || undefined),
      is_ongoing: form.is_ongoing,
      translations: {
        ko: {
          title: form.translations.ko.title.trim() || undefined,
          description: form.translations.ko.description.trim() || undefined
        },
        ja: {
          title: form.translations.ja.title.trim() || undefined,
          description: form.translations.ja.description.trim() || undefined
        }
      }
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
      cover_image: form.cover_image.trim() || undefined,
      stack: form.stack,
      demo_url: form.demo_url.trim() || undefined,
      repo_url: form.repo_url.trim() || undefined,
      start_date: form.start_date || undefined,
      end_date: form.is_ongoing ? undefined : (form.end_date || undefined),
      is_ongoing: form.is_ongoing,
      translations: {
        ko: {
          title: form.translations.ko.title.trim() || undefined,
          description: form.translations.ko.description.trim() || undefined
        },
        ja: {
          title: form.translations.ja.title.trim() || undefined,
          description: form.translations.ja.description.trim() || undefined
        }
      }
    }

    await updateProject(slug.value, data)

    // Update overview doc if exists
    if (overviewDocId.value && form.overview_content.trim()) {
      await updateProjectDoc(slug.value, 'overview', 'overview', {
        content: form.overview_content.trim()
      })
    }
    
    // Clear draft if successful
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
.project-edit-page {
  min-height: 100vh;
  background: #faf9f6;
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
  font-family: var(--font-body);
}

.back-link:hover {
  color: #111;
}

.step-title {
  font-family: 'Playfair Display', 'NanumSquare_ac', 'NanumSquare', serif;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 8px;
  color: #111;
}

.step-subtitle {
  font-family: var(--font-body);
  font-size: 16px;
  color: #666;
  margin: 0;
}

.info-form {
  background: #fff;
  padding: 40px;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.error-message {
  padding: 16px;
  background: #ffebee;
  border: 1px solid #ef9a9a;
  color: #c62828;
  margin-bottom: 0;
  font-family: var(--font-body);
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
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.form-field input,
.form-field textarea {
  padding: 12px 14px;
  border: 1px solid #e0e0e0;
  font-size: 16px;
  font-family: var(--font-body);
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
  font-family: var(--font-body);
}

/* Banner Image Upload */
.banner-upload {
  border: 1px solid #e0e0e0;
  padding: 16px;
  background: #fafafa;
}

.banner-preview {
  position: relative;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 16 / 10;
  margin-bottom: 12px;
  border-radius: 4px;
  overflow: hidden;
}

.banner-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-remove {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.banner-remove:hover {
  background: rgba(200, 0, 0, 0.8);
}

.banner-placeholder {
  width: 100%;
  max-width: 400px;
  aspect-ratio: 16 / 10;
  background: #f0f0f0;
  border: 2px dashed #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: #999;
  font-family: var(--font-body);
}

.banner-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.btn-upload {
  padding: 8px 16px;
  background: #111;
  color: #fff;
  border: 1px solid #111;
  font-family: var(--font-body);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-upload:hover:not(:disabled) {
  background: #333;
}

.btn-upload:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.banner-hint {
  color: #999;
  font-size: 13px;
  font-family: var(--font-body);
}

.banner-url-input {
  flex: 1;
  min-width: 200px;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  font-size: 14px;
  font-family: var(--font-body);
}

.banner-url-input:focus {
  outline: none;
  border-color: #111;
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
  font-family: var(--font-body);
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
  font-family: var(--font-body);
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
  font-family: var(--font-body);
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
  font-family: var(--font-body);
  font-size: 14px;
  cursor: pointer;
}

.btn-cancel:hover {
  border-color: #111;
}

.btn-save {
  padding: 12px 24px;
  background: #111;
  border: 1px solid #111;
  color: #fff;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-save:hover:not(:disabled) {
  background: #333;
}

.btn-next {
  padding: 12px 28px;
  background: #111;
  border: 1px solid #111;
  color: #fff;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
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
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
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
  position: relative;
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
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
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

.editor-container {
  flex: 1;
  min-height: 0;
  overflow: visible;
  margin: 0 80px;
  background: #fff;
  border-left: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
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

  .editor-container {
    margin: 0 20px;
  }
}
</style>

<style scoped>
/* Language Tabs - reusing/scoped style */
.lang-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 1rem;
}

.lang-tab {
  background: transparent;
  border: 1px solid #ddd;
  color: #666;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.lang-tab:hover {
  background: #f5f5f5;
  color: #333;
}

.lang-tab.active {
  background: #111;
  border-color: #111;
  color: white;
}
</style>
