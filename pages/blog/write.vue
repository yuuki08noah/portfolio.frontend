<template>
  <div class="blog-write-page">
    <!-- Top Bar -->
    <header class="top-bar">
      <div class="top-bar-inner">
        <NuxtLink to="/blog" class="back-btn">
          <span class="back-icon">←</span>
          <span class="back-text">Back to Blog</span>
        </NuxtLink>
        
        <div class="top-bar-actions">
          <button 
            type="button" 
            class="btn-draft" 
            :disabled="submitting"
            @click="saveDraft"
          >
            Save Draft
          </button>
          <button 
            type="button" 
            class="btn-publish" 
            :disabled="submitting"
            @click="openPublishModal"
          >
            {{ submitting ? 'Saving...' : 'Publish' }}
          </button>
        </div>
      </div>
    </header>

    <!-- Main Editor Area -->
    <div class="editor-layout">
      <!-- Left: Editor -->
      <div class="editor-pane">
        <div class="editor-inner">
          <input
            v-model="form.title"
            type="text"
            class="title-input"
            placeholder="Article Title"
          />
          <div class="title-underline"></div>
          
          <!-- Cover Image Upload -->
          <div class="cover-image-section">
            <div v-if="form.coverImage" class="cover-preview">
              <img :src="form.coverImage" alt="Cover" />
              <button type="button" class="remove-cover" @click="removeCoverImage">×</button>
            </div>
            <div v-else class="cover-upload">
              <input 
                type="file" 
                id="cover-input" 
                accept="image/*" 
                @change="handleCoverUpload"
                hidden
              />
              <label for="cover-input" class="upload-label">
                <span class="upload-icon">🖼️</span>
                <span>Add Cover Image</span>
              </label>
              <span class="or-text">or</span>
              <input
                v-model="coverImageUrl"
                type="text"
                class="url-input"
                placeholder="Paste image URL..."
                @blur="setCoverFromUrl"
                @keydown.enter.prevent="setCoverFromUrl"
              />
            </div>
          </div>
          
          <div class="tags-area">
            <span v-for="(tag, idx) in form.tags" :key="idx" class="tag-chip">
              {{ tag }}
              <button type="button" @click="removeTag(idx)">×</button>
            </span>
            <input
              v-model="newTag"
              type="text"
              class="tag-input"
              placeholder="Add tags..."
              @keydown.enter.prevent="addTag"
            />
          </div>
          
          <!-- Toolbar -->
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
            v-model="form.content"
            class="markdown-editor"
            placeholder="Write your story..."
            @keydown.tab.prevent="handleTab"
          ></textarea>
        </div>
      </div>

      <!-- Right: Preview -->
      <div class="preview-pane">
        <div class="preview-inner">
          <article class="preview-article">
            <div v-if="form.coverImage" class="preview-cover">
              <img :src="form.coverImage" alt="Cover" />
            </div>
            <h1 v-if="form.title" class="preview-title">{{ form.title }}</h1>
            <div class="preview-content" v-html="renderedContent"></div>
            <p v-if="!form.content" class="preview-placeholder">Your story will appear here...</p>
          </article>
        </div>
      </div>
    </div>

    <!-- Publish Modal -->
    <div v-if="showPublishModal" class="modal-overlay" @click.self="closePublishModal">
      <div class="publish-modal">
        <h2>Publish Article</h2>
        
        <div class="modal-section">
          <label>Category</label>
          <select v-model="form.category">
            <option value="">No Category</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
        
        <div class="modal-section">
          <label>Visibility</label>
          <div class="visibility-options">
            <label class="radio-option">
              <input type="radio" v-model="form.isPublic" :value="true" />
              <span>Public</span>
            </label>
            <label class="radio-option">
              <input type="radio" v-model="form.isPublic" :value="false" />
              <span>Private</span>
            </label>
          </div>
        </div>
        
        <div class="modal-actions">
          <button type="button" class="btn-cancel" @click="closePublishModal">Cancel</button>
          <button type="button" class="btn-confirm" @click="publish" :disabled="submitting">
            {{ submitting ? 'Publishing...' : 'Publish Now' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Error Toast -->
    <div v-if="error" class="error-toast">
      {{ error }}
      <button @click="error = null">×</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import type { Category } from '~/types'

definePageMeta({
  middleware: ['auth'],
  layout: false
})

const router = useRouter()
const { createPost, fetchCategories } = useBlog()

// Prevent body scroll
onMounted(() => {
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.body.style.overflow = ''
})

const form = reactive({
  title: '',
  content: '',
  tags: [] as string[],
  category: '',
  isPublic: true,
  coverImage: ''
})

const categories = ref<Category[]>([])
const newTag = ref('')
const coverImageUrl = ref('')
const error = ref<string | null>(null)
const submitting = ref(false)
const editorRef = ref<HTMLTextAreaElement | null>(null)
const showPublishModal = ref(false)

const handleCoverUpload = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  
  // For now, convert to base64 - in production, upload to server/CDN
  const reader = new FileReader()
  reader.onload = () => {
    form.coverImage = reader.result as string
  }
  reader.readAsDataURL(file)
}

const setCoverFromUrl = () => {
  if (coverImageUrl.value.trim()) {
    form.coverImage = coverImageUrl.value.trim()
    coverImageUrl.value = ''
  }
}

const removeCoverImage = () => {
  form.coverImage = ''
}

const renderedContent = computed(() => {
  let html = form.content
    .replace(/```(\w*)\n([\s\S]*?)```/gim, '<pre><code class="language-$1">$2</code></pre>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/~~(.*?)~~/gim, '<del>$1</del>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" />')
    .replace(/^\s*[-*]\s+(.*)$/gim, '<li>$1</li>')
    .replace(/^>\s+(.*)$/gim, '<blockquote>$1</blockquote>')
    .replace(/^---$/gim, '<hr>')
    .replace(/\n\n/gim, '</p><p>')
    .replace(/\n/gim, '<br>')
  
  if (html && !html.startsWith('<')) {
    html = '<p>' + html + '</p>'
  }
  
  return html
})

const loadCategories = async () => {
  try {
    const response = await fetchCategories()
    categories.value = response?.data || []
  } catch (e) {
    console.error('Failed to load categories:', e)
  }
}

const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !form.tags.includes(tag) && form.tags.length < 10) {
    form.tags.push(tag)
    newTag.value = ''
  }
}

const removeTag = (idx: number) => {
  form.tags.splice(idx, 1)
}

const handleTab = (e: KeyboardEvent) => {
  const textarea = e.target as HTMLTextAreaElement
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  
  form.content = form.content.substring(0, start) + '  ' + form.content.substring(end)
  
  nextTick(() => {
    textarea.selectionStart = textarea.selectionEnd = start + 2
  })
}

const insertMarkdown = (prefix: string) => {
  const textarea = editorRef.value
  if (!textarea) return
  
  const start = textarea.selectionStart
  form.content = form.content.substring(0, start) + prefix + form.content.substring(start)
  
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
  const selected = form.content.substring(start, end)
  
  form.content = form.content.substring(0, start) + wrapper + selected + wrapper + form.content.substring(end)
  
  nextTick(() => {
    textarea.focus()
    textarea.selectionStart = start + wrapper.length
    textarea.selectionEnd = end + wrapper.length
  })
}

const insertLink = () => {
  const url = prompt('Enter URL:')
  if (url) {
    insertMarkdown(`[link text](${url})`)
  }
}

const insertCodeBlock = () => {
  insertMarkdown('```\ncode here\n```')
}

const openPublishModal = () => {
  if (!form.title.trim()) {
    error.value = 'Please enter a title'
    return
  }
  if (!form.content.trim()) {
    error.value = 'Please enter content'
    return
  }
  showPublishModal.value = true
}

const closePublishModal = () => {
  showPublishModal.value = false
}

const saveDraft = async () => {
  if (!form.title.trim()) {
    error.value = 'Please enter a title'
    return
  }
  await savePost('draft')
}

const publish = async () => {
  await savePost('published')
  closePublishModal()
}

const savePost = async (status: 'draft' | 'published') => {
  error.value = null
  submitting.value = true

  try {
    const postData = {
      title: form.title.trim(),
      content: form.content.trim(),
      tags: form.tags,
      category_id: form.category || undefined,
      status,
      is_public: form.isPublic,
      cover_image: form.coverImage || undefined
    }

    const response = await createPost(postData)
    const slug = response?.data?.slug || response?.slug
    
    if (slug) {
      router.push(`/blog/post/${slug}`)
    } else {
      router.push('/blog')
    }
  } catch (e: any) {
    error.value = e.data?.error?.message || e.data?.message || 'Failed to save'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.blog-write-page {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #faf9f6;
}

/* Top Bar - NYT Style */
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
  text-decoration: none;
  font-family: 'Georgia', serif;
  font-size: 14px;
  transition: color 0.2s;
}

.back-btn:hover {
  color: #111;
}

.back-icon {
  font-size: 16px;
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

/* Editor Layout */
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

/* Title Input - NYT Style */
.title-input {
  width: 100%;
  padding: 0;
  border: none;
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #111;
  line-height: 1.2;
  background: transparent;
  letter-spacing: -0.02em;
}

.title-input:focus {
  outline: none;
}

.title-input::placeholder {
  color: #999;
}

.title-underline {
  width: 80px;
  height: 3px;
  background: #111;
  margin: 20px 0 28px;
}

/* Cover Image */
.cover-image-section {
  margin-bottom: 24px;
}

.cover-preview {
  position: relative;
  width: 100%;
  max-height: 300px;
  border-radius: 4px;
  overflow: hidden;
}

.cover-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-preview .remove-cover {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0,0,0,0.6);
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.cover-preview .remove-cover:hover {
  background: rgba(0,0,0,0.8);
}

.cover-upload {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 2px dashed #ddd;
  border-radius: 4px;
  background: #fafafa;
}

.upload-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #111;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  transition: background 0.2s;
}

.upload-label:hover {
  background: #333;
}

.upload-icon {
  font-size: 1rem;
}

.or-text {
  color: #999;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
}

.url-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
}

.url-input:focus {
  outline: none;
  border-color: #111;
}

/* Preview Cover */
.preview-cover {
  margin: -32px -40px 24px;
  max-height: 400px;
  overflow: hidden;
}

.preview-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Tags */
.tags-area {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e0e0e0;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  font-family: 'Georgia', serif;
  font-size: 13px;
  color: #333;
}

.tag-chip button {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  line-height: 1;
}

.tag-chip button:hover {
  color: #111;
}

.tag-input {
  flex: 1;
  min-width: 100px;
  padding: 6px 0;
  border: none;
  font-family: 'Georgia', serif;
  font-size: 13px;
  color: #333;
  background: transparent;
}

.tag-input:focus {
  outline: none;
}

.tag-input::placeholder {
  color: #999;
}

/* Toolbar - NYT Style */
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

/* Markdown Editor */
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

/* Preview - NYT Article Style */
.preview-article {
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.preview-title {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #111;
  line-height: 1.2;
  margin: 0 0 32px;
  letter-spacing: -0.02em;
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

/* Preview Typography */
.preview-content :deep(h1) {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: 2rem;
  font-weight: 700;
  margin: 48px 0 20px;
  color: #111;
}

.preview-content :deep(h2) {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: 1.6rem;
  font-weight: 700;
  margin: 40px 0 16px;
  color: #111;
}

.preview-content :deep(h3) {
  font-family: 'Georgia', serif;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 32px 0 12px;
  color: #111;
}

.preview-content :deep(p) {
  margin: 0 0 24px;
}

.preview-content :deep(strong) {
  font-weight: 700;
}

.preview-content :deep(em) {
  font-style: italic;
}

.preview-content :deep(a) {
  color: #326891;
  text-decoration: underline;
}

.preview-content :deep(a:hover) {
  color: #111;
}

.preview-content :deep(blockquote) {
  margin: 32px 0;
  padding: 0 0 0 24px;
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
  margin: 24px 0;
  padding: 20px;
  background: #f5f5f5;
  overflow-x: auto;
}

.preview-content :deep(pre code) {
  padding: 0;
  background: transparent;
}

.preview-content :deep(img) {
  max-width: 100%;
  margin: 32px 0;
}

.preview-content :deep(hr) {
  margin: 48px 0;
  border: none;
  border-top: 1px solid #e0e0e0;
}

/* Modal - NYT Style */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.publish-modal {
  width: 420px;
  padding: 40px;
  background: #fff;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.publish-modal h2 {
  margin: 0 0 32px;
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111;
}

.modal-section {
  margin-bottom: 24px;
}

.modal-section label {
  display: block;
  margin-bottom: 8px;
  font-family: 'Georgia', serif;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.modal-section select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  font-family: 'Georgia', serif;
  font-size: 14px;
  color: #333;
  background: #fff;
}

.visibility-options {
  display: flex;
  gap: 24px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-family: 'Georgia', serif;
  font-size: 14px;
  color: #333;
}

.radio-option input {
  cursor: pointer;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
}

.btn-cancel {
  padding: 12px 24px;
  background: transparent;
  border: 1px solid #ccc;
  font-family: 'Georgia', serif;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.btn-cancel:hover {
  border-color: #111;
}

.btn-confirm {
  padding: 12px 28px;
  background: #111;
  border: 1px solid #111;
  font-family: 'Georgia', serif;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
}

.btn-confirm:hover:not(:disabled) {
  background: #333;
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Error Toast */
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

/* Responsive */
@media (max-width: 1200px) {
  .top-bar-inner {
    padding-left: 40px;
    padding-right: 40px;
  }
  
  .editor-layout {
    margin: 0 60px;
  }
  
  .editor-inner,
  .preview-inner {
    padding-left: 32px;
    padding-right: 32px;
  }
}

@media (max-width: 1024px) {
  .editor-layout {
    grid-template-columns: 1fr;
  }

  .preview-pane {
    display: none;
  }

  .editor-pane {
    border-right: none;
  }
}

@media (max-width: 768px) {
  .top-bar-inner {
    padding-left: 24px;
    padding-right: 24px;
  }
  
  .editor-layout {
    margin: 0;
  }
  
  .editor-inner {
    padding-left: 20px;
    padding-right: 20px;
  }

  .title-input {
    font-size: 1.8rem;
  }

  .back-text {
    display: none;
  }
}
</style>
