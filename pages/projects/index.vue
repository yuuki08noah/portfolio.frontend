<template>
  <div class="projects-page">
    <section class="projects-hero">
      <div class="container">
        <div class="hero-header">
          <div>
            <h1 class="page-title">Projects</h1>
            <div class="hero-divider"></div>
            <p class="page-subtitle">A curation of digital products and technical experiments.</p>
          </div>
          <NuxtLink v-if="isAdmin()" to="/admin/projects/new" class="btn-new-project">
            + New Project
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Search and Filter -->
    <section class="projects-filter">
      <div class="container">
        <div class="filter-row">
          <div class="search-wrapper">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search projects..."
              class="search-input"
              @input="debouncedSearch"
            />
            <span class="search-icon">🔍</span>
          </div>
          <div class="sort-group">
            <span class="sort-label">Sort by</span>
            <select v-model="sortBy" class="sort-select" @change="loadProjects">
              <option value="date">Date</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <section class="projects-grid">
      <div class="container">
        <div v-if="loading" class="loading">Loading...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else-if="projects.length === 0" class="empty">No projects found</div>
        <div v-else class="grid">
          <ProjectCard
            v-for="project in projects"
            :key="project.id"
            :project="project"
          />
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button
            :disabled="currentPage <= 1"
            class="page-btn"
            @click="goToPage(currentPage - 1)"
          >
            Previous
          </button>
          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
          <button
            :disabled="currentPage >= totalPages"
            class="page-btn"
            @click="goToPage(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { PortfolioProject } from '~/types/portfolio'
import ProjectCard from '~/components/ProjectCard.vue'

const { fetchProjects } = useProjects()
const { isAdmin } = useAuth()

const projects = ref<PortfolioProject[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const searchQuery = ref('')
const sortBy = ref('date')
const sortOrder = ref<'asc' | 'desc'>('desc')
const currentPage = ref(1)
const totalPages = ref(1)
const limit = 12

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const loadProjects = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetchProjects({
      page: currentPage.value,
      limit,
      sort: sortBy.value,
      order: sortOrder.value,
      search: searchQuery.value || undefined
    })

    projects.value = response.projects
    if (response.meta) {
      totalPages.value = response.meta.totalPages
    }
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to load projects'
    projects.value = []
  } finally {
    loading.value = false
  }
}

const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadProjects()
  }, 300)
}

const goToPage = (page: number) => {
  currentPage.value = page
  loadProjects()
}

onMounted(() => {
  loadProjects()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Merriweather:wght@300;400;700&family=Inter:wght@400;500;600&display=swap');

.projects-page {
  min-height: 100vh;
  background-color: #fff;
  color: #111;
  font-family: 'Merriweather', serif;
}

.projects-hero {
  padding: 100px 0 60px;
  border-bottom: 1px solid #f0f0f0;
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
}

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 4rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 30px;
  letter-spacing: -1px;
}

.hero-divider {
  width: 60px;
  height: 2px;
  background-color: #111;
  margin-bottom: 20px;
}

.page-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
}

.btn-new-project {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #111;
  color: #fff;
  padding: 12px 24px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 1px solid #111;
  border-radius: 4px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.btn-new-project:hover {
  background: #fff;
  color: #111;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.projects-filter {
  padding: 40px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.search-wrapper {
  position: relative;
  width: 300px;
}

.search-input {
  width: 100%;
  padding: 10px 0 10px 30px;
  border: none;
  border-bottom: 1px solid #ddd;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #111;
  background: transparent;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-bottom-color: #111;
}

.search-icon {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  opacity: 0.5;
  filter: grayscale(100%);
}

.sort-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

.sort-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.sort-select {
  border: none;
  background: transparent;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #111;
  font-weight: 600;
  cursor: pointer;
  padding-right: 15px;
}

.sort-select:focus {
  outline: none;
}

.projects-grid {
  padding: 80px 0 120px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 60px 40px;
}

.loading, .error, .empty {
  text-align: center;
  padding: 80px;
  color: #999;
  font-family: 'Inter', sans-serif;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-top: 100px;
}

.page-btn {
  background: none;
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #111;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 10px 20px;
  transition: opacity 0.3s ease;
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-info {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  color: #666;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 3rem;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-wrapper {
    width: 100%;
  }
  
  .grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
</style>
