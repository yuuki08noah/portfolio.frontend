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
              <article class="section-card">
                <div class="card-image-wrapper">
                  <img src="/images/profile-visual.png" alt="Profile" class="card-image" />
                </div>
                <div class="card-content">
                  <div class="card-meta">
                    <span class="card-category">Biography</span>
                  </div>
                  <h3><NuxtLink to="/profile">The Developer Profile</NuxtLink></h3>
                  <p>An in-depth look at the background, skills, and professional philosophy that drives my work.</p>
                </div>
              </article>
              
              <article class="section-card">
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
            </div>
          </div>
          
          <!-- Right Sidebar -->
          <aside class="sidebar-right">
            <SidebarRight />
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import HeroBanner from '~/components/HeroBanner.vue';
import SidebarLeft from '~/components/SidebarLeft.vue'
import SidebarRight from '~/components/SidebarRight.vue'
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
  filter: grayscale(100%) contrast(1.1);
  transition: filter 0.3s ease;
}

.section-card:hover .card-image {
  filter: grayscale(0%) contrast(1);
}

.card-content {
  display: flex;
  flex-direction: column;
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
</style>
