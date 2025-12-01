<template>
  <AdminLayout :title="post?.title || 'Blog Post'" subtitle="View post details">
    <template #actions>
      <div class="action-buttons">
        <NuxtLink :to="`/admin/blog/${post?.id}/edit`" class="btn-edit">
          Edit Post
        </NuxtLink>
        <button v-if="post?.status === 'draft'" class="btn-publish" @click="handlePublish">
          Publish
        </button>
        <button class="btn-delete" @click="showDeleteModal = true">
          Delete
        </button>
      </div>
    </template>

    <div v-if="loading" class="loading">Loading post...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="!post" class="empty">Post not found</div>
    <div v-else class="post-detail">
      <!-- Post Header -->
      <div class="post-header">
        <div class="post-meta-top">
          <span :class="['status-badge', post.status]">{{ post.status }}</span>
          <span v-if="post.is_public" class="visibility-badge public">Public</span>
          <span v-else class="visibility-badge private">Private</span>
        </div>
        
        <h1 class="post-title">{{ post.title }}</h1>
        <p v-if="post.subtitle" class="post-subtitle">{{ post.subtitle }}</p>
        
        <div class="post-info">
          <span v-if="post.published_at" class="info-item">
            <strong>Published:</strong> {{ formatDate(post.published_at) }}
          </span>
          <span v-if="post.views" class="info-item">
            <strong>Views:</strong> {{ post.views }}
          </span>
          <span v-if="post.category_id" class="info-item">
            <strong>Category:</strong> {{ post.category_id }}
          </span>
        </div>
        
        <div v-if="post.tags?.length" class="post-tags">
          <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>

      <!-- Cover Image -->
      <div v-if="post.cover_image" class="cover-image-wrapper">
        <img :src="post.cover_image" :alt="post.title" class="cover-image" />
      </div>

      <!-- Post Content -->
      <div class="post-content">
        <h2 class="section-title">Content Preview</h2>
        <div class="content-preview">
          <MarkdownRenderer :content="post.content || ''" />
        </div>
      </div>

      <!-- Excerpt -->
      <div v-if="post.excerpt" class="post-excerpt">
        <h2 class="section-title">Excerpt</h2>
        <p>{{ post.excerpt }}</p>
      </div>

      <!-- Raw Content (for debugging) -->
      <details class="raw-content">
        <summary>View Raw Markdown</summary>
        <pre>{{ post.content }}</pre>
      </details>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal">
        <h2>Delete Post</h2>
        <p>Are you sure you want to delete "{{ post?.title }}"?</p>
        <p class="warning">This action cannot be undone.</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showDeleteModal = false">Cancel</button>
          <button class="btn-confirm-delete" :disabled="deleting" @click="handleDelete">
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '~/components/admin/AdminLayout.vue'
import MarkdownRenderer from '~/components/blog/MarkdownRenderer.vue'

definePageMeta({
  middleware: ['admin'],
  ssr: true
})

const route = useRoute()
const router = useRouter()
const { fetchBlogPost, deleteBlogPost, updateBlogPost } = useBlogPosts()

const postId = route.params.id as string
const post = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const showDeleteModal = ref(false)
const deleting = ref(false)

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadPost = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await fetchBlogPost(postId, true)
    post.value = response.post
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to load post'
  } finally {
    loading.value = false
  }
}

const handlePublish = async () => {
  if (!post.value) return
  try {
    await updateBlogPost(post.value.id, {
      status: 'published',
      published_at: new Date().toISOString(),
      is_public: true
    })
    post.value.status = 'published'
    post.value.is_public = true
    post.value.published_at = new Date().toISOString()
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to publish post'
  }
}

const handleDelete = async () => {
  if (!post.value) return
  deleting.value = true
  try {
    await deleteBlogPost(post.value.id)
    router.push('/admin/blog')
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to delete post'
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadPost()
})
</script>

<style scoped>
.action-buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.btn-edit, .btn-publish, .btn-delete {
  padding: var(--spacing-sm) var(--spacing-lg);
  font-weight: 700;
  font-size: var(--text-sm);
  border-radius: var(--radius-sm);
  cursor: pointer;
  text-decoration: none;
  transition: all var(--transition-fast);
  border: none;
}

.btn-edit {
  background: var(--color-text);
  color: var(--color-white);
}

.btn-edit:hover {
  background: var(--color-accent);
}

.btn-publish {
  background: #28a745;
  color: white;
}

.btn-publish:hover {
  background: #218838;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-delete:hover {
  background: #c82333;
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

.post-detail {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.post-header {
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
}

.post-meta-top {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.status-badge {
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  font-weight: 700;
  font-size: var(--text-xs);
}

.status-badge.draft {
  background: #fff3cd;
  color: #856404;
}

.status-badge.published {
  background: #d4edda;
  color: #155724;
}

.status-badge.archived {
  background: #e2e3e5;
  color: #383d41;
}

.visibility-badge {
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: var(--text-xs);
}

.visibility-badge.public {
  background: #cce5ff;
  color: #004085;
}

.visibility-badge.private {
  background: #f8d7da;
  color: #721c24;
}

.post-title {
  font-size: var(--text-3xl);
  font-weight: 900;
  margin: 0 0 var(--spacing-sm);
  color: var(--color-text);
}

.post-subtitle {
  font-size: var(--text-lg);
  color: var(--color-muted);
  margin: 0 0 var(--spacing-md);
}

.post-info {
  display: flex;
  gap: var(--spacing-lg);
  font-size: var(--text-sm);
  color: var(--color-muted);
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
}

.info-item strong {
  color: var(--color-text);
}

.post-tags {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.tag {
  padding: 4px 10px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 600;
}

.cover-image-wrapper {
  padding: var(--spacing-xl);
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}

.cover-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.post-content {
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: 700;
  margin: 0 0 var(--spacing-md);
  color: var(--color-text);
}

.content-preview {
  background: var(--color-bg);
  padding: var(--spacing-lg);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  max-height: 600px;
  overflow-y: auto;
}

.post-excerpt {
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
}

.post-excerpt p {
  margin: 0;
  color: var(--color-muted);
  line-height: 1.6;
}

.raw-content {
  padding: var(--spacing-xl);
}

.raw-content summary {
  cursor: pointer;
  font-weight: 600;
  color: var(--color-muted);
  font-size: var(--text-sm);
}

.raw-content pre {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  background: #1e1e1e;
  color: #d4d4d4;
  border-radius: var(--radius-sm);
  overflow-x: auto;
  font-size: var(--text-sm);
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
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
}

.modal {
  background: var(--color-white);
  padding: var(--spacing-xl);
  border-radius: var(--radius-md);
  max-width: 400px;
  width: 90%;
}

.modal h2 {
  margin: 0 0 var(--spacing-md);
  font-size: var(--text-xl);
}

.modal p {
  margin: 0 0 var(--spacing-md);
  color: var(--color-muted);
}

.modal .warning {
  color: #c62828;
  font-size: var(--text-sm);
}

.modal-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-lg);
}

.btn-cancel {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.btn-confirm-delete {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: #c62828;
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.btn-confirm-delete:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
  }
  
  .post-info {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}
</style>
