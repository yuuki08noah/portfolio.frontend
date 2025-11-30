<template>
  <article class="project-card">
    <NuxtLink :to="`/projects/${project.slug}`" class="card-link">
      <div class="card-image-wrapper">
        <img :src="project.coverImage || project.souvenirs?.[0] || defaultImage" :alt="project.title" class="card-image" />
        <div class="card-badge" v-if="project.status">{{ project.status }}</div>
      </div>
      
      <div class="card-content">
        <div class="card-meta">
          <span class="card-category">{{ project.category || 'Project' }}</span>
          <span class="card-date" v-if="project.startDate">{{ formatDate(project.startDate) }}</span>
        </div>
        
        <h2 class="card-title">{{ project.title }}</h2>
        
        <p class="card-description">{{ project.description }}</p>
        
        <div class="card-stack">
          <span v-for="tech in project.stack?.slice(0, 4)" :key="tech" class="tech-tag">
            {{ tech }}
          </span>
          <span v-if="project.stack && project.stack.length > 4" class="tech-more">
            +{{ project.stack.length - 4 }}
          </span>
        </div>
        
        <div class="card-action">
          <span class="view-project">View Project</span>
          <svg class="arrow-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import type { PortfolioProject } from '~/types/portfolio'

defineProps<{
  project: PortfolioProject
}>()

const defaultImage = '/images/projects-visual.png'

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short' 
  })
}
</script>

<style scoped>
.project-card {
  display: block;
  background: #fff;
  border-radius: 0;
  overflow: hidden;
  border: 1px solid #e5e5e5;
  transition: all 0.3s ease;
}

.project-card:hover {
  border-color: #111;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
  background-color: transparent !important;
}

.card-link:hover {
  background-color: transparent !important;
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: #f5f5f5;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.project-card:hover .card-image {
  transform: scale(1.03);
}

.card-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  background: #fff;
  border: 1px solid #e5e5e5;
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #333;
}

.card-content {
  padding: 20px;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.card-category {
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #666;
}

.card-date {
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  color: #999;
}

.card-title {
  font-family: 'Inter', sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: #111;
  margin: 0 0 10px;
  line-height: 1.3;
  transition: color 0.3s ease;
}

.project-card:hover .card-title {
  text-decoration: underline;
}

.card-description {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.tech-tag {
  padding: 3px 8px;
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  color: #555;
  transition: all 0.3s ease;
}

.project-card:hover .tech-tag {
  background: #fff;
  border-color: #ccc;
}

.tech-more {
  padding: 3px 8px;
  background: transparent;
  border: 1px dashed #ccc;
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  color: #999;
}

.card-action {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-top: 14px;
  border-top: 1px solid #eee;
}

.view-project {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #111;
  transition: all 0.3s ease;
}

.arrow-icon {
  color: #111;
  transition: all 0.3s ease;
  transform: translateX(0);
}

.project-card:hover .view-project {
  text-decoration: underline;
}

.project-card:hover .arrow-icon {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .card-content {
    padding: 16px;
  }
  
  .card-title {
    font-size: 1.1rem;
  }
}
</style>
