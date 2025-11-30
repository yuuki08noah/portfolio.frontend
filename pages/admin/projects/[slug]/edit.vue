<template>
  <div class="project-form-page">
    <div class="container">
      <header class="page-header">
        <NuxtLink to="/admin/projects" class="back-link">← Back to Projects</NuxtLink>
        <h1 class="page-title">Edit Project</h1>
      </header>

      <div v-if="loading" class="loading">Loading project...</div>
      <div v-else-if="loadError" class="error">{{ loadError }}</div>
      <form v-else class="project-form" @submit.prevent="handleSubmit">
        <div v-if="error" class="error-message">{{ error }}</div>

        <!-- Basic Info -->
        <section class="form-section">
          <h2 class="section-title">Basic Information</h2>
          
          <div class="form-group">
            <label for="title">Title *</label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              maxlength="100"
              placeholder="Project title"
            />
          </div>

          <div class="form-group">
            <label for="description">Description *</label>
            <textarea
              id="description"
              v-model="form.description"
              required
              maxlength="1000"
              rows="4"
              placeholder="Brief description of the project (shown on card)"
            ></textarea>
            <span class="char-count">{{ form.description.length }}/1000</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="start_date">Start Date</label>
              <input
                id="start_date"
                v-model="form.start_date"
                type="date"
              />
            </div>

            <div class="form-group">
              <label for="end_date">End Date</label>
              <input
                id="end_date"
                v-model="form.end_date"
                type="date"
                :disabled="form.is_ongoing"
              />
            </div>
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="form.is_ongoing"
              />
              <span>Currently ongoing (In Progress)</span>
            </label>
          </div>
        </section>

        <!-- Tech Stack -->
        <section class="form-section">
          <h2 class="section-title">Tech Stack *</h2>
          <div class="tags-input">
            <div class="tags-list">
              <span v-for="(tech, idx) in form.stack" :key="idx" class="tag">
                {{ tech }}
                <button type="button" class="tag-remove" @click="removeStack(idx)">×</button>
              </span>
            </div>
            <input
              v-model="newStack"
              type="text"
              placeholder="Add technology and press Enter"
              @keydown.enter.prevent="addStack"
            />
          </div>
        </section>

        <!-- Features -->
        <section class="form-section">
          <h2 class="section-title">Key Features</h2>
          <div class="list-input">
            <div v-for="(item, idx) in form.itinerary" :key="idx" class="list-item">
              <input
                v-model="form.itinerary[idx]"
                type="text"
                placeholder="Feature description"
              />
              <button type="button" class="btn-remove" @click="removeItinerary(idx)">×</button>
            </div>
            <button type="button" class="btn-add" @click="addItinerary">+ Add Feature</button>
          </div>
        </section>

        <!-- Links -->
        <section class="form-section">
          <h2 class="section-title">Links</h2>
          
          <div class="form-group">
            <label for="demo_url">Demo URL</label>
            <input
              id="demo_url"
              v-model="form.demo_url"
              type="url"
              placeholder="https://demo.example.com"
            />
          </div>

          <div class="form-group">
            <label for="repo_url">Repository URL</label>
            <input
              id="repo_url"
              v-model="form.repo_url"
              type="url"
              placeholder="https://github.com/user/repo"
            />
          </div>
        </section>

        <!-- Images -->
        <section class="form-section">
          <h2 class="section-title">Screenshots</h2>
          <div class="image-upload">
            <div v-for="(img, idx) in form.souvenirs" :key="idx" class="image-preview">
              <img :src="img" alt="Screenshot" />
              <button type="button" class="btn-remove-img" @click="removeImage(idx)">×</button>
            </div>
            <label class="upload-btn">
              <input
                type="file"
                accept="image/*"
                multiple
                @change="handleImageUpload"
              />
              <span>+ Add Images</span>
            </label>
          </div>
        </section>

        <!-- Submit -->
        <div class="form-actions">
          <NuxtLink to="/admin/projects" class="btn-cancel">Cancel</NuxtLink>
          <button type="submit" class="btn-submit" :disabled="submitting">
            {{ submitting ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'

definePageMeta({
  middleware: ['admin']
})

const route = useRoute()
const router = useRouter()
const slug = computed(() => route.params.slug as string)

const { fetchProject, updateProject } = useProjects()

const form = reactive({
  title: '',
  description: '',
  start_date: '',
  end_date: '',
  is_ongoing: false,
  stack: [] as string[],
  itinerary: [] as string[],
  demo_url: '',
  repo_url: '',
  souvenirs: [] as string[]
})

const newStack = ref('')
const loading = ref(true)
const loadError = ref<string | null>(null)
const error = ref<string | null>(null)
const submitting = ref(false)

const loadProject = async () => {
  loading.value = true
  loadError.value = null

  try {
    const response = await fetchProject(slug.value)
    const project = response.project
    
    form.title = project.title || ''
    form.description = project.description || ''
    form.start_date = project.start_date || ''
    form.end_date = project.end_date || ''
    form.is_ongoing = project.is_ongoing || false
    form.stack = project.stack || []
    form.itinerary = project.itinerary || []
    form.demo_url = project.links?.demo || ''
    form.repo_url = project.links?.repo || ''
    form.souvenirs = project.souvenirs || []
  } catch (e: any) {
    loadError.value = e.data?.message || 'Failed to load project'
  } finally {
    loading.value = false
  }
}

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

const addItinerary = () => {
  form.itinerary.push('')
}

const removeItinerary = (idx: number) => {
  form.itinerary.splice(idx, 1)
}

const removeImage = (idx: number) => {
  form.souvenirs.splice(idx, 1)
}

const handleImageUpload = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return

  for (const file of Array.from(input.files)) {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.souvenirs.push(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }
  input.value = ''
}

const isValidUrl = (url: string): boolean => {
  if (!url) return true
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const handleSubmit = async () => {
  error.value = null

  if (!form.title.trim()) {
    error.value = 'Title is required'
    return
  }
  if (form.title.length > 100) {
    error.value = 'Title must be 100 characters or less'
    return
  }
  if (!form.description.trim()) {
    error.value = 'Description is required'
    return
  }
  if (form.description.length > 1000) {
    error.value = 'Description must be 1000 characters or less'
    return
  }
  if (form.stack.length === 0) {
    error.value = 'At least one technology is required'
    return
  }
  if (form.demo_url && !isValidUrl(form.demo_url)) {
    error.value = 'Demo URL is not valid'
    return
  }
  if (form.repo_url && !isValidUrl(form.repo_url)) {
    error.value = 'Repository URL is not valid'
    return
  }
  if (form.start_date && form.end_date && !form.is_ongoing) {
    if (new Date(form.end_date) < new Date(form.start_date)) {
      error.value = 'End date must be after start date'
      return
    }
  }

  submitting.value = true

  try {
    const data = {
      title: form.title.trim(),
      description: form.description.trim(),
      stack: form.stack,
      itinerary: form.itinerary.filter(i => i.trim()),
      demo_url: form.demo_url.trim() || undefined,
      repo_url: form.repo_url.trim() || undefined,
      start_date: form.start_date || undefined,
      end_date: form.is_ongoing ? undefined : (form.end_date || undefined),
      is_ongoing: form.is_ongoing,
      souvenirs: form.souvenirs
    }

    await updateProject(slug.value, data)
    router.push('/admin/projects')
  } catch (e: any) {
    error.value = e.data?.error?.message || e.data?.message || 'Failed to update project'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadProject()
})
</script>

<style scoped>
.project-form-page {
  min-height: 100vh;
  padding: var(--spacing-2xl) 0;
  background: var(--color-bg);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.page-header {
  margin-bottom: var(--spacing-2xl);
}

.back-link {
  display: inline-block;
  margin-bottom: var(--spacing-md);
  font-size: var(--text-sm);
  color: var(--color-muted);
  text-decoration: none;
}

.back-link:hover {
  color: var(--color-text);
}

.page-title {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 900;
  margin: 0;
}

.loading, .error {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-muted);
}

.error {
  color: #dc3545;
}

.project-form {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-xl);
}

.error-message {
  padding: var(--spacing-md);
  background: #ffebee;
  border: 1px solid #ef9a9a;
  border-radius: var(--radius-sm);
  color: #c62828;
  margin-bottom: var(--spacing-lg);
}

.form-section {
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
}

.form-section:last-of-type {
  border-bottom: none;
}

.section-title {
  font-size: var(--text-lg);
  font-weight: 700;
  margin: 0 0 var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  font-size: var(--text-sm);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-base);
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-text);
}

.form-group input:disabled {
  background: var(--color-bg);
  color: var(--color-muted);
  cursor: not-allowed;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.checkbox-group {
  margin-top: var(--spacing-sm);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-weight: normal;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  cursor: pointer;
}

.char-count {
  display: block;
  text-align: right;
  font-size: var(--text-xs);
  color: var(--color-muted);
  margin-top: var(--spacing-xs);
}

.tags-input {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm);
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 4px 8px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
}

.tag-remove {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: var(--text-lg);
  line-height: 1;
  color: var(--color-muted);
}

.tag-remove:hover {
  color: #c62828;
}

.tags-input input {
  width: 100%;
  padding: var(--spacing-sm);
  border: none;
  outline: none;
  font-size: var(--text-base);
}

.list-input {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.list-item {
  display: flex;
  gap: var(--spacing-sm);
}

.list-item input {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-base);
}

.btn-remove {
  padding: 0 var(--spacing-sm);
  background: #ffebee;
  border: 1px solid #ef9a9a;
  border-radius: var(--radius-sm);
  color: #c62828;
  cursor: pointer;
  font-size: var(--text-lg);
}

.btn-add {
  padding: var(--spacing-sm);
  background: var(--color-bg);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: var(--text-sm);
  color: var(--color-muted);
}

.btn-add:hover {
  border-color: var(--color-text);
  color: var(--color-text);
}

.image-upload {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--spacing-md);
}

.image-preview {
  position: relative;
  aspect-ratio: 16/9;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove-img {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  font-size: var(--text-base);
}

.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 16/9;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--color-muted);
  transition: all var(--transition-fast);
}

.upload-btn:hover {
  border-color: var(--color-text);
  color: var(--color-text);
}

.upload-btn input {
  display: none;
}

.form-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--color-border);
}

.btn-cancel {
  padding: var(--spacing-sm) var(--spacing-xl);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--color-text);
  font-weight: 600;
}

.btn-submit {
  padding: var(--spacing-sm) var(--spacing-xl);
  background: var(--color-text);
  border: none;
  border-radius: var(--radius-sm);
  color: var(--color-white);
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-submit:hover:not(:disabled) {
  background: var(--color-accent);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .project-form {
    padding: var(--spacing-lg);
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-cancel, .btn-submit {
    width: 100%;
    text-align: center;
  }
}
</style>
