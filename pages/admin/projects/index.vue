<template>
  <AdminLayout title="Projects" subtitle="Manage your portfolio projects">
    <template #actions>
      <NuxtLink to="/admin/projects/new" class="btn-create">
        + New Project
      </NuxtLink>
    </template>

    <div v-if="loading" class="loading">Loading projects...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="projects.length === 0" class="empty">
      <p>No projects yet.</p>
      <NuxtLink to="/admin/projects/new" class="btn-primary">Create your first project</NuxtLink>
    </div>
    <div v-else class="projects-table-wrapper">
        <table class="projects-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Stack</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="project in projects" :key="project.id">
              <td>
                <NuxtLink :to="`/projects/${project.slug}`" class="project-link">
                  {{ project.title }}
                </NuxtLink>
              </td>
              <td>
                <div class="tech-chips">
                  <span v-for="tech in project.stack?.slice(0, 3)" :key="tech" class="tech-chip">
                    {{ tech }}
                  </span>
                  <span v-if="project.stack?.length > 3" class="tech-chip more">
                    +{{ project.stack.length - 3 }}
                  </span>
                </div>
              </td>
              <td class="date-cell">
                <span v-if="project.is_ongoing" class="ongoing-badge">In Progress</span>
                <span v-else>{{ formatDateRange(project.start_date, project.end_date) }}</span>
              </td>
              <td>
                <div class="actions">
                  <NuxtLink :to="`/admin/projects/${project.slug}/edit`" class="btn-edit">
                    Edit
                  </NuxtLink>
                  <NuxtLink :to="`/admin/projects/${project.slug}/docs`" class="btn-docs">
                    Docs
                  </NuxtLink>
                  <button class="btn-delete" @click="confirmDelete(project)">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
      </table>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
        <div class="modal">
          <h2>Delete Project</h2>
          <p>Are you sure you want to delete "{{ deleteTarget.title }}"?</p>
          <p class="warning">This action cannot be undone. All related documents and images will also be deleted.</p>
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
import { ref, onMounted } from 'vue'
import AdminLayout from '~/components/admin/AdminLayout.vue'
import type { PortfolioProject } from '~/types/portfolio'

definePageMeta({
  middleware: ['admin'],
  ssr: true
})

const { fetchProjects, deleteProject } = useProjects()

const projects = ref<PortfolioProject[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const deleteTarget = ref<PortfolioProject | null>(null)
const deleting = ref(false)

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  })
}

const formatDateRange = (startDate?: string, endDate?: string) => {
  if (!startDate && !endDate) return '-'
  const start = startDate ? formatDate(startDate) : '?'
  const end = endDate ? formatDate(endDate) : '?'
  if (start === end) return start
  return `${start} - ${end}`
}

const loadProjects = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await fetchProjects()
    projects.value = response.projects
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to load projects'
  } finally {
    loading.value = false
  }
}

const confirmDelete = (project: PortfolioProject) => {
  deleteTarget.value = project
}

const handleDelete = async () => {
  if (!deleteTarget.value) return
  
  deleting.value = true
  try {
    await deleteProject(deleteTarget.value.slug)
    projects.value = projects.value.filter(p => p.id !== deleteTarget.value?.id)
    deleteTarget.value = null
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to delete project'
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadProjects()
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
  font-size: var(--text-sm);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.btn-primary:hover {
  background: var(--color-accent);
}

.loading, .error, .empty {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-muted);
}

.error {
  color: #dc3545;
}

.empty {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.projects-table-wrapper {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.projects-table {
  width: 100%;
  border-collapse: collapse;
}

.projects-table th,
.projects-table td {
  padding: var(--spacing-md) var(--spacing-lg);
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.projects-table th {
  background: var(--color-bg);
  font-size: var(--text-sm);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.projects-table tbody tr:hover {
  background: var(--color-bg);
}

.project-link {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 600;
}

.project-link:hover {
  color: var(--color-accent);
}

.tech-chips {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.tech-chip {
  font-size: var(--text-xs);
  padding: 2px 8px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}

.tech-chip.more {
  color: var(--color-muted);
}

.date-cell {
  color: var(--color-muted);
  font-size: var(--text-sm);
}

.ongoing-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 600;
}

.actions {
  display: flex;
  gap: var(--spacing-sm);
}

.btn-edit, .btn-docs, .btn-delete {
  padding: 4px 12px;
  font-size: var(--text-xs);
  font-weight: 600;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-edit {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  text-decoration: none;
}

.btn-edit:hover {
  background: var(--color-text);
  color: var(--color-white);
}

.btn-docs {
  background: #e3f2fd;
  border: 1px solid #90caf9;
  color: #1976d2;
  text-decoration: none;
}

.btn-docs:hover {
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
  .page-header {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }

  .page-title {
    font-size: 2rem;
  }

  .projects-table th,
  .projects-table td {
    padding: var(--spacing-sm);
  }

  .actions {
    flex-direction: column;
  }
}
</style>
