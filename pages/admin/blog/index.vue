<template>
  <AdminLayout title="Blog Posts" subtitle="Manage your blog posts">
    <template #actions>
      <NuxtLink to="/admin/blog/new" class="btn-create">
        + New Post
      </NuxtLink>
    </template>

    <!-- Filter Tabs -->
    <div class="filter-tabs">
      <button
        v-for="filter in filters"
        :key="filter.value"
        :class="['filter-btn', { active: activeFilter === filter.value }]"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
        <span class="count">{{ getFilterCount(filter.value) }}</span>
      </button>
    </div>

    <div v-if="loading" class="loading">Loading posts...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="filteredPosts.length === 0" class="empty">
      <p>No posts yet.</p>
      <NuxtLink to="/admin/blog/new" class="btn-primary">Create your first post</NuxtLink>
    </div>
    <div v-else class="posts-list">
      <div v-for="post in filteredPosts" :key="post.id" class="post-item">
        <NuxtLink :to="`/admin/blog/${post.id}`" class="post-info">
          <h3 class="post-title">{{ post.title }}</h3>
          <p v-if="post.subtitle" class="post-subtitle">{{ post.subtitle }}</p>
          <div class="post-meta">
            <span :class="['status-badge', post.status]">{{ post.status }}</span>
            <span v-if="post.tags && post.tags.length > 0" class="tags">
              <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
            </span>
            <span v-if="post.published_at" class="date">{{ formatDate(post.published_at) }}</span>
          </div>
        </NuxtLink>
        <div class="post-actions">
          <NuxtLink :to="`/admin/blog/${post.id}`" class="btn-view">
            View
          </NuxtLink>
          <NuxtLink :to="`/admin/blog/${post.id}/edit`" class="btn-edit">
            Edit
          </NuxtLink>
          <button class="btn-delete" @click="confirmDelete(post)">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
      <div class="modal">
        <h2>Delete Post</h2>
        <p>Are you sure you want to delete "{{ deleteTarget.title }}"?</p>
        <p class="warning">This action cannot be undone.</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="deleteTarget = null">Cancel</button>
          <button class="btn-confirm-delete" :disabled="deleting" @click="handleDelete">
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '~/components/admin/AdminLayout.vue'

definePageMeta({
  middleware: ['admin'],
  ssr: true
})

const { fetchBlogPosts, deleteBlogPost } = useBlogPosts()

const posts = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const activeFilter = ref('all')
const deleteTarget = ref<any>(null)
const deleting = ref(false)

const filters = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Drafts' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' }
]

const filteredPosts = computed(() => {
  if (activeFilter.value === 'all') return posts.value
  return posts.value.filter(p => p.status === activeFilter.value)
})

const getFilterCount = (filter: string) => {
  if (filter === 'all') return posts.value.length
  return posts.value.filter(p => p.status === filter).length
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const loadPosts = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await fetchBlogPosts()
    posts.value = response.posts || []
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to load posts'
  } finally {
    loading.value = false
  }
}

const confirmDelete = (post: any) => {
  deleteTarget.value = post
}

const handleDelete = async () => {
  if (!deleteTarget.value) return

  deleting.value = true
  try {
    await deleteBlogPost(deleteTarget.value.id)
    posts.value = posts.value.filter(p => p.id !== deleteTarget.value?.id)
    deleteTarget.value = null
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to delete post'
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadPosts()
})
</script>

<style scoped>
.btn-create {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-text);
  color: var(--color-white);
  text-decoration: none;
  font-weight: 700;
  font-size: var(--text-sm);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.btn-create:hover {
  background: var(--color-accent);
}

.btn-primary {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-text);
  color: var(--color-white);
  text-decoration: none;
  font-weight: 700;
  border-radius: var(--radius-sm);
}

.filter-tabs {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
}

.filter-btn {
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

.filter-btn:hover {
  border-color: var(--color-text);
}

.filter-btn.active {
  background: var(--color-text);
  color: var(--color-white);
  border-color: var(--color-text);
}

.filter-btn .count {
  font-size: var(--text-xs);
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: var(--radius-sm);
}

.filter-btn.active .count {
  background: rgba(255, 255, 255, 0.2);
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

.posts-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.post-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  transition: border-color var(--transition-fast);
}

.post-item:hover {
  border-color: var(--color-text);
}

.post-info {
  flex: 1;
  text-decoration: none;
  display: block;
}

.post-info:hover .post-title {
  color: var(--color-accent);
}

.post-title {
  font-size: var(--text-lg);
  font-weight: 700;
  margin: 0 0 var(--spacing-xs);
  color: var(--color-text);
}

.post-subtitle {
  font-size: var(--text-sm);
  color: var(--color-muted);
  margin: 0 0 var(--spacing-sm);
}

.post-meta {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
  font-size: var(--text-xs);
  flex-wrap: wrap;
}

.status-badge {
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  font-weight: 600;
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

.tags {
  display: flex;
  gap: 4px;
}

.tag {
  padding: 2px 8px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}

.date {
  color: var(--color-muted);
}

.post-actions {
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
  transition: all var(--transition-fast);
}

.btn-view {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.btn-view:hover {
  background: var(--color-text);
  color: var(--color-white);
}

.btn-edit {
  background: #e3f2fd;
  border: 1px solid #90caf9;
  color: #1976d2;
}

.btn-edit:hover {
  background: #1976d2;
  color: white;
}

.btn-delete {
  background: #ffebee;
  border: 1px solid #ef9a9a;
  color: #c62828;
}

.btn-delete:hover {
  background: #c62828;
  color: white;
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
  .post-item {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-md);
  }

  .post-actions {
    justify-content: flex-end;
  }
}
</style>
