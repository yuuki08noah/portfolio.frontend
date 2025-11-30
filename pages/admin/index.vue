<template>
  <AdminLayout title="Projects" subtitle="Manage your portfolio projects">
    <template #actions>
      <NuxtLink to="/admin/projects/new" class="btn-create">
        <span class="icon">+</span> New Project
      </NuxtLink>
    </template>

    <div class="admin-grid">
      <div v-for="project in projects" :key="project.id" class="project-card">
        <div class="card-header">
          <span :class="['status-badge', project.isOngoing ? 'status-ongoing' : 'status-completed']">
            {{ project.isOngoing ? 'Ongoing' : 'Completed' }}
          </span>
          <span class="project-year">{{ project.date }}</span>
        </div>
        
        <div class="card-content">
          <h3 class="project-title">{{ project.title }}</h3>
          <p class="project-desc">{{ project.description }}</p>
        </div>

        <div class="card-actions">
          <button class="action-btn edit">Edit</button>
          <button class="action-btn delete">Delete</button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '~/components/admin/AdminLayout.vue'

// Mock data for UI development
const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with real-time inventory management.",
    date: "2024",
    isOngoing: true
  },
  {
    id: 2,
    title: "Travel Blog System",
    description: "Content management system tailored for travel photographers.",
    date: "2023",
    isOngoing: false
  },
  {
    id: 3,
    title: "AI Analytics Tool",
    description: "Data visualization dashboard powered by machine learning algorithms.",
    date: "2023",
    isOngoing: false
  }
]
</script>

<style scoped>
.btn-create {
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

.btn-create:hover {
  background: #fff;
  color: #111;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 40px;
  margin-top: 40px;
}

.project-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  padding: 32px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: relative;
}

.project-card:hover {
  border-color: #111;
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 0;
  background: #111;
  transition: height 0.3s ease;
}

.project-card:hover::before {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.status-badge {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 4px 8px;
  border: 1px solid currentColor;
}

.status-ongoing {
  color: #2563eb;
  border-color: #2563eb;
}

.status-completed {
  color: #10b981;
  border-color: #10b981;
}

.project-year {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  color: #999;
  font-size: 1.1rem;
}

.card-content {
  flex: 1;
  margin-bottom: 32px;
}

.project-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 12px;
  line-height: 1.2;
}

.project-desc {
  font-family: 'Merriweather', serif;
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-actions {
  display: flex;
  gap: 16px;
  border-top: 1px solid #f0f0f0;
  padding-top: 20px;
}

.action-btn {
  background: none;
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  padding: 4px 0;
  transition: all 0.2s ease;
  position: relative;
}

.action-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background-color: currentColor;
  transition: width 0.3s ease;
}

.action-btn:hover::after {
  width: 100%;
}

.action-btn.edit {
  color: #111;
}

.action-btn.edit:hover {
  color: #000;
}

.action-btn.delete {
  color: #ef4444;
}

.action-btn.delete:hover {
  color: #dc2626;
}
</style>
