<template>
  <div class="admin-page">
    <div class="admin-container">
      <header class="admin-header">
        <div class="header-top">
          <h1 class="admin-title">Admin Dashboard</h1>
          <nav class="admin-nav">
            <NuxtLink to="/admin" :class="['nav-link', { active: isActive('/admin', true) }]">Projects</NuxtLink>
            <NuxtLink to="/admin/profile" :class="['nav-link', { active: isActive('/admin/profile') }]">Profile</NuxtLink>
            <NuxtLink to="/admin/books" :class="['nav-link', { active: isActive('/admin/books') }]">Books</NuxtLink>
            <NuxtLink to="/admin/travel" :class="['nav-link', { active: isActive('/admin/travel') }]">Travel</NuxtLink>
            <NuxtLink to="/admin/settings" :class="['nav-link', { active: isActive('/admin/settings') }]">Settings</NuxtLink>
          </nav>
        </div>
        <div class="divider"></div>
      </header>

      <div class="admin-content">
        <div class="content-header">
          <div class="header-left">
            <NuxtLink v-if="backLink" :to="backLink" class="back-link">← Back</NuxtLink>
            <h2 class="section-title">{{ title }}</h2>
            <p v-if="subtitle" class="section-subtitle">{{ subtitle }}</p>
          </div>
          <div class="header-right">
            <slot name="actions" />
          </div>
        </div>

        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  subtitle?: string
  backLink?: string
}>()

const route = useRoute()

const isActive = (path: string, exact = false) => {
  if (exact) {
    return route.path === path || route.path === '/admin/projects' || route.path.startsWith('/admin/projects/')
  }
  return route.path.startsWith(path)
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #fff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #111;
}

.admin-container {
  max-width: 1400px; /* Expanded width */
  margin: 0 auto;
  padding: 80px 60px;
}

.admin-header {
  margin-bottom: 60px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-end; /* Align to bottom for better visual balance */
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 4px double #111; /* Editorial style border */
}

.admin-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 3.5rem; /* Larger title */
  font-weight: 700;
  margin: 0;
  color: #111;
  line-height: 1;
  letter-spacing: -1px;
}

.admin-nav {
  display: flex;
  gap: 40px;
}

.nav-link {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding-bottom: 6px;
  position: relative;
  background: transparent;
  transition: color 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #111;
  transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.nav-link:hover {
  color: #111;
  background: transparent;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link.active {
  color: #111;
  font-weight: 700;
  background: transparent;
}

.nav-link.active::after {
  width: 100%;
}

.divider {
  display: none; /* Removed in favor of header-top border */
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
}

.header-left {
  flex: 1;
}

.back-link {
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
  text-decoration: none;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: color 0.2s;
}

.back-link:hover {
  color: #111;
}

.section-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  color: #111;
  letter-spacing: -0.5px;
}

.section-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #666;
  margin: 12px 0 0;
  max-width: 600px;
  line-height: 1.5;
}

.header-right {
  display: flex;
  gap: 16px;
}

@media (max-width: 1024px) {
  .admin-container {
    padding: 60px 40px;
  }
}

@media (max-width: 768px) {
  .admin-container {
    padding: 40px 24px;
  }

  .header-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }

  .admin-title {
    font-size: 2.5rem;
  }

  .admin-nav {
    flex-wrap: wrap;
    gap: 20px;
  }

  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }
  
  .section-title {
    font-size: 2rem;
  }
}
</style>
