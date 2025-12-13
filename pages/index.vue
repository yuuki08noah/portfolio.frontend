<template>
  <div class="page-wrapper">
    <HeroBanner />
    
    <section class="main-content">
      <div class="content-container">
        <div class="content-grid">
          <!-- Left Sidebar -->
          <aside class="sidebar-left">
            <SidebarLeft />
          </aside>
          
          <!-- Center Content -->
          <div class="center-column">
            <header class="section-header">
              <h2 class="section-title">Featured</h2>
            </header>
            
            <div class="sections-list">
              <!-- Loading Skeleton -->
              <template v-if="loading">
                <article class="section-card skeleton-card">
                  <div class="card-image-wrapper">
                    <div class="skeleton skeleton-image"></div>
                  </div>
                  <div class="card-content">
                    <div class="skeleton skeleton-category"></div>
                    <div class="skeleton skeleton-title"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text short"></div>
                  </div>
                </article>
                
                <article class="section-card skeleton-card">
                  <div class="card-image-wrapper">
                    <div class="skeleton skeleton-image"></div>
                  </div>
                  <div class="card-content">
                    <div class="skeleton skeleton-category"></div>
                    <div class="skeleton skeleton-title"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text short"></div>
                  </div>
                </article>
              </template>
              
              <!-- Loaded Content -->
              <template v-else>
                <article class="section-card">
                  <div class="card-image-wrapper">
                    <img :src="profile?.avatar_url || '/images/profile-visual.png'" alt="Profile" class="card-image" />
                  </div>
                  <div class="card-content">
                    <div class="card-meta">
                      <span class="card-category">Biography</span>
                    </div>
                    <h3><NuxtLink to="/profile">{{ profile?.name || 'The Developer Profile' }}</NuxtLink></h3>
                    <p>{{ profile?.tagline || 'An in-depth look at the background, skills, and professional philosophy that drives my work.' }}</p>
                  </div>
                </article>
                
                <article v-if="featuredProject" class="section-card">
                  <div class="card-image-wrapper">
                    <img 
                      :src="featuredProject.coverImage || '/images/projects-visual.png'" 
                      :alt="featuredProject.title" 
                      class="card-image"
                      @error="handleImageError"
                    />
                  </div>
                  <div class="card-content">
                    <div class="card-meta">
                      <span class="card-category">{{ featuredProject.category || 'Portfolio' }}</span>
                    </div>
                    <h3><NuxtLink :to="`/projects/${featuredProject.slug}`">{{ featuredProject.title }}</NuxtLink></h3>
                    <p>{{ featuredProject.summary || featuredProject.description }}</p>
                  </div>
                </article>
                
                <article v-else class="section-card">
                  <div class="card-image-wrapper">
                    <img src="/images/projects-visual.png" alt="Projects" class="card-image" />
                  </div>
                  <div class="card-content">
                    <div class="card-meta">
                      <span class="card-category">Portfolio</span>
                    </div>
                    <h3><NuxtLink to="/projects">Projects</NuxtLink></h3>
                    <p>Explore a curated collection of technical projects and achievements.</p>
                  </div>
                </article>
              </template>
            </div>
          </div>
          
          <!-- Right Sidebar -->
          <aside class="sidebar-right">
            <SidebarRight :projects="recentProjects" :loading="loading" />
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import HeroBanner from '~/components/HeroBanner.vue';
import SidebarLeft from '~/components/SidebarLeft.vue'
import SidebarRight from '~/components/SidebarRight.vue'
import { useApi } from '~/composables/useApi'

const { getLocalized } = useApi()

interface Profile {
  name: string
  tagline: string
  avatar_url: string
}

interface Project {
  id: number
  title: string
  slug: string
  summary?: string
  description?: string
  category?: string
  coverImage?: string
  featured?: boolean
}

const loading = ref(true)
const profile = ref<Profile | null>(null)
const featuredProject = ref<Project | null>(null)
const recentProjects = ref<Project[]>([])

const loadData = async () => {
  loading.value = true
  try {
    const [profileRes, projectsRes] = await Promise.all([
      getLocalized<{ profile: Profile }>('/portfolio/profile', false),
      getLocalized<{ projects: Project[] }>('/portfolio/projects', false)
    ])
    
    if (profileRes?.profile) {
      profile.value = profileRes.profile
    }
    
    if (projectsRes?.projects) {
      // Featured project (first featured or first project)
      featuredProject.value = projectsRes.projects.find(p => p.featured) || projectsRes.projects[0] || null
      // Recent projects for sidebar (top 3)
      recentProjects.value = projectsRes.projects.slice(0, 3)
    }
  } catch (e) {
    console.error('Failed to load data:', e)
  } finally {
    loading.value = false
  }
}

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  if (target.src !== '/images/projects-visual.png') {
    target.src = '/images/projects-visual.png'
  }
}

onMounted(loadData)
</script>

<style scoped>
.page-wrapper {
  background: var(--color-bg);
}

.main-content {
  margin-top: var(--spacing-2xl);
  background: white;
}

/* Same max-width and padding as header for alignment */
.content-container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
}

.content-grid {
  display: grid;
  grid-template-columns: 200px 1fr 250px;
  gap: var(--spacing-3xl);
  align-items: start;
}

.sidebar-left,
.sidebar-right {
  position: sticky;
  top: 120px;
}

.center-column {
  min-width: 0;
}

.section-header {
  margin-bottom: var(--spacing-2xl);
  border-bottom: 1px solid #666; /* Darker gray */
  padding-bottom: var(--spacing-md);
}

.section-title {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: 900;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  margin: 0;
  color: #111; /* Stronger contrast */
}

.sections-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.section-card {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: var(--spacing-lg);
  padding-bottom: var(--spacing-2xl);
  border-bottom: 1px solid #ddd; /* Visible light gray */
}

.section-card:last-child {
  border-bottom: 1px solid #666; /* Match header */
}

.card-image-wrapper {
  width: 100%;
  height: 150px;
  overflow: hidden;
  border: 1px solid #eee; /* Light border for image */
  background: var(--color-light-gray);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.3s ease;
}

.section-card:hover .card-image {
  /* filter removed */
}

.card-content {
  gap: var(--spacing-sm);
}

.card-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.card-category {
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-black);
  letter-spacing: 0.1em;
  border-bottom: 2px solid var(--color-black);
  padding-bottom: 2px;
}

.section-card h3 {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.section-card h3 a {
  color: var(--color-black);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.section-card h3 a:hover {
  background: none;
  text-decoration: underline;
  text-decoration-thickness: 2px;
}

.section-card p {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text);
  line-height: 1.6;
  margin: 0;
  max-width: none;
}

@media (max-width: 1024px) {
  .content-container {
    padding: 0 var(--spacing-lg);
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }
  
  .sidebar-left,
  .sidebar-right {
    position: static;
  }
}

@media (max-width: 768px) {
  .content-container {
    padding: 0 var(--spacing-lg);
  }
  
  .section-card {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .card-image-wrapper {
    height: 180px;
  }
}

/* Skeleton Loading Styles */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-image {
  width: 100%;
  height: 100%;
}

.skeleton-category {
  width: 80px;
  height: 14px;
  margin-bottom: 8px;
}

.skeleton-title {
  width: 70%;
  height: 28px;
  margin-bottom: 12px;
}

.skeleton-text {
  width: 100%;
  height: 16px;
  margin-bottom: 8px;
}

.skeleton-text.short {
  width: 60%;
}
</style>
