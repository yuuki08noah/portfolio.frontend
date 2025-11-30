<template>
  <div class="project-detail-page">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
    </div>
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <NuxtLink to="/projects" class="btn-back">Back to Projects</NuxtLink>
    </div>
    <template v-else-if="project">
      <!-- Hero Section -->
      <section class="hero-section" :style="{ backgroundImage: `url(${project.coverImage || project.souvenirs?.[0] || '/images/projects-visual.png'})` }">
        <div class="hero-overlay"></div>
        <div class="container hero-content">
          <NuxtLink to="/projects" class="back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Projects
          </NuxtLink>
          
          <div class="hero-text fade-up">
            <div class="project-meta-top">
              <span class="project-category" v-if="project.category">{{ project.category }}</span>
              <span class="meta-divider" v-if="project.category && project.startDate">•</span>
              <span class="project-date" v-if="project.startDate">{{ formatDate(project.startDate) }}</span>
            </div>
            
            <h1 class="project-title">{{ project.title }}</h1>
            <p class="project-subtitle">{{ project.description }}</p>
            
            <div class="hero-actions">
              <a v-if="project.links?.demo" :href="project.links.demo" target="_blank" class="btn btn-primary">
                Visit Website
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                </svg>
              </a>
              <a v-if="project.links?.repo" :href="project.links.repo" target="_blank" class="btn btn-outline">
                View Code
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div class="content-wrapper">
        <div class="container">
          <div class="project-grid">
            <!-- Main Content -->
            <div class="main-column">
              <!-- Overview -->
              <section v-if="overviewContent" class="section overview-section">
                <h2 class="section-heading">Overview</h2>
                <article class="prose" v-html="renderedOverview"></article>
              </section>

              <!-- Features -->
              <section v-if="project.itinerary?.length" class="section features-section">
                <h2 class="section-heading">Key Features</h2>
                <div class="features-grid">
                  <div v-for="(feature, idx) in project.itinerary" :key="idx" class="feature-card">
                    <div class="feature-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    </div>
                    <span class="feature-text">{{ feature }}</span>
                  </div>
                </div>
              </section>

              <!-- Screenshots -->
              <section v-if="project.souvenirs?.length" class="section gallery-section">
                <h2 class="section-heading">Gallery</h2>
                <div class="gallery-grid">
                  <div v-for="(img, idx) in project.souvenirs" :key="idx" class="gallery-item" @click="openLightbox(idx)">
                    <img :src="img" :alt="`Project screenshot ${idx + 1}`" loading="lazy" />
                    <div class="gallery-overlay">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        <line x1="11" y1="8" x2="11" y2="14"/>
                        <line x1="8" y1="11" x2="14" y2="11"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <!-- Sidebar -->
            <aside class="sidebar-column">
              <div class="sticky-sidebar">
                <!-- Tech Stack -->
                <div class="sidebar-widget">
                  <h3 class="widget-title">Technologies</h3>
                  <div class="tech-tags">
                    <span v-for="tech in project.stack" :key="tech" class="tech-tag">
                      {{ tech }}
                    </span>
                  </div>
                </div>

                <!-- Documentation -->
                <div v-if="nonOverviewDocs.length > 0" class="sidebar-widget">
                  <h3 class="widget-title">Documentation</h3>
                  <div class="docs-nav">
                    <div class="doc-filters">
                      <button 
                        v-for="cat in availableCategories" 
                        :key="cat.value"
                        :class="['filter-btn', { active: activeCategory === cat.value }]"
                        @click="activeCategory = cat.value"
                      >
                        {{ cat.label }}
                      </button>
                    </div>
                    
                    <div class="docs-links">
                      <NuxtLink
                        v-for="doc in filteredDocs"
                        :key="doc.id"
                        :to="`/projects/${slug}/docs/${doc.category}/${doc.slug}`"
                        class="doc-link-item"
                      >
                        <span class="doc-icon">📄</span>
                        <div class="doc-info">
                          <span class="doc-link-title">{{ doc.title }}</span>
                          <span class="doc-link-meta">{{ getCategoryLabel(doc.category) }}</span>
                        </div>
                        <svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { marked } from 'marked'
import type { PortfolioProject, ProjectBlogPost } from '~/types/portfolio'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { fetchProject, fetchProjectDocs } = useProjects()

const project = ref<PortfolioProject | null>(null)
const docs = ref<ProjectBlogPost[]>([])
const loading = ref(true)
const docsLoading = ref(true)
const error = ref<string | null>(null)
const activeCategory = ref('all')

const categories = [
  { value: 'all', label: 'All' },
  { value: 'technical', label: 'Technical' },
  { value: 'troubleshooting', label: 'Troubleshooting' },
  { value: 'devlog', label: 'Dev Log' },
  { value: 'reference', label: 'Reference' }
]

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  })
}

// Get overview doc content
const overviewDoc = computed(() => {
  return docs.value.find(d => d.category === 'overview')
})

const overviewContent = computed(() => {
  return overviewDoc.value?.content || ''
})

const renderedOverview = computed(() => {
  if (!overviewContent.value) return ''
  try {
    return marked(overviewContent.value)
  } catch (e) {
    return '<p>Error rendering content</p>'
  }
})

// Filter out overview from docs list
const nonOverviewDocs = computed(() => {
  return docs.value.filter(d => d.category !== 'overview')
})

const availableCategories = computed(() => {
  const cats = new Set(nonOverviewDocs.value.map(d => d.category))
  return [
    { value: 'all', label: 'All' },
    ...categories.filter(c => c.value !== 'all' && cats.has(c.value))
  ]
})

const filteredDocs = computed(() => {
  if (activeCategory.value === 'all') return nonOverviewDocs.value
  return nonOverviewDocs.value.filter(d => d.category === activeCategory.value)
})

const getCategoryLabel = (cat: string) => {
  return categories.find(c => c.value === cat)?.label || cat
}

const loadProject = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetchProject(slug.value)
    project.value = response.project
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to load project'
  } finally {
    loading.value = false
  }
}

const loadDocs = async () => {
  docsLoading.value = true
  try {
    const response = await fetchProjectDocs(slug.value)
    docs.value = response.docs || []
  } catch (e: any) {
    docs.value = []
  } finally {
    docsLoading.value = false
  }
}

const openLightbox = (index: number) => {
  // Implement lightbox logic here if needed, or just open image in new tab
  // For now we'll just let it be a visual interaction
}

onMounted(() => {
  loadProject()
  loadDocs()
})

watch(slug, () => {
  loadProject()
  loadDocs()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');

.project-detail-page {
  min-height: 100vh;
  background-color: #fff;
  font-family: 'Inter', sans-serif;
  color: #111;
}

/* Loading & Error States */
.loading-state, .error-state {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #111;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-up {
  animation: fadeUp 0.8s ease-out forwards;
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 70vh;
  min-height: 500px;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  color: #fff;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.3) 0%,
    rgba(0,0,0,0.6) 50%,
    rgba(0,0,0,0.8) 100%
  );
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 40px;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: #fff;
}

.hero-text {
  max-width: 800px;
}

.project-meta-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255,255,255,0.9);
}

.project-title {
  font-family: 'Playfair Display', serif;
  font-size: 4.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin: 0 0 24px;
  letter-spacing: -1px;
}

.project-subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  color: rgba(255,255,255,0.9);
  max-width: 600px;
  margin: 0 0 40px;
  font-weight: 300;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary {
  background: #fff;
  color: #111;
  border: 1px solid #fff;
}

.btn-primary:hover {
  background: #f0f0f0;
  border-color: #f0f0f0;
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.5);
}

.btn-outline:hover {
  background: rgba(255,255,255,0.1);
  border-color: #fff;
  transform: translateY(-2px);
}

/* Content Layout */
.content-wrapper {
  padding: 80px 0;
  background: #fff;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

.project-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 80px;
}

/* Main Column */
.section {
  margin-bottom: 80px;
}

.section-heading {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
  color: #111;
}

/* Prose / Overview */
.prose {
  font-family: 'Georgia', serif;
  font-size: 1.125rem;
  line-height: 1.8;
  color: #333;
}

.prose :deep(h2) {
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  margin: 48px 0 24px;
  color: #111;
}

.prose :deep(p) {
  margin-bottom: 24px;
}

.prose :deep(img) {
  width: 100%;
  border-radius: 8px;
  margin: 32px 0;
}

/* Features */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.feature-card {
  padding: 24px;
  background: #f9f9f9;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-3px);
  background: #f5f5f5;
}

.feature-icon {
  color: #111;
  flex-shrink: 0;
}

.feature-text {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #444;
}

/* Gallery */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.gallery-item {
  position: relative;
  aspect-ratio: 16/10;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.gallery-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: #fff;
}

.gallery-item:hover img {
  transform: scale(1.05);
}

.gallery-item:hover .gallery-overlay {
  opacity: 1;
}

/* Sidebar */
.sticky-sidebar {
  position: sticky;
  top: 40px;
}

.sidebar-widget {
  margin-bottom: 48px;
}

.widget-title {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #999;
  margin: 0 0 20px;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  padding: 6px 14px;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 100px;
  font-size: 0.85rem;
  color: #444;
  font-weight: 500;
}

/* Doc Links */
.doc-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.filter-btn {
  background: none;
  border: none;
  font-size: 0.8rem;
  color: #999;
  cursor: pointer;
  padding: 4px 0;
  font-weight: 500;
  transition: color 0.3s ease;
}

.filter-btn:hover, .filter-btn.active {
  color: #111;
  text-decoration: underline;
}

.docs-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.doc-link-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  text-decoration: none;
  color: #111;
  transition: all 0.3s ease;
}

.doc-link-item:hover {
  border-color: #111;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.doc-icon {
  font-size: 1.2rem;
}

.doc-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.doc-link-title {
  font-size: 0.95rem;
  font-weight: 600;
}

.doc-link-meta {
  font-size: 0.75rem;
  color: #999;
  text-transform: uppercase;
}

.arrow {
  color: #ccc;
  transition: color 0.3s ease;
}

.doc-link-item:hover .arrow {
  color: #111;
}

/* Responsive */
@media (max-width: 1024px) {
  .project-grid {
    grid-template-columns: 1fr;
    gap: 60px;
  }
  
  .sidebar-column {
    order: -1; /* Move sidebar up on mobile if desired, or keep below */
  }
}

@media (max-width: 768px) {
  .project-title {
    font-size: 3rem;
  }
  
  .container {
    padding: 0 24px;
  }
  
  .hero-section {
    height: auto;
    min-height: 400px;
    padding: 100px 0 60px;
  }
  
  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>
