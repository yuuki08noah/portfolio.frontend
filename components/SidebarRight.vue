<template>
  <aside class="sidebar-right">
    <div class="sidebar-widget">
      <h3 class="widget-title">Popular</h3>
      <ul class="trending-list">
        <li v-for="(project, index) in trendingProjects" :key="index">
          <span class="rank">{{ index + 1 }}</span>
          <div class="project-info">
            <a href="#" class="project-link">{{ project.title }}</a>
            <span class="project-meta">{{ project.category }}</span>
          </div>
        </li>
      </ul>
    </div>

    <div class="sidebar-widget">
      <h3 class="widget-title">Newsletter</h3>
      <p class="widget-text">Get updates on my development journey.</p>
      <form class="newsletter-form" @submit.prevent>
        <input type="email" placeholder="Email address" class="input-sm">
        <button class="btn-subscribe">Subscribe</button>
      </form>
    </div>
  </aside>
</template>

<script setup lang="ts">
const trendingProjects = [
  { title: 'E-Commerce Platform', category: 'Full Stack' },
  { title: 'Travel Blog System', category: 'Frontend' },
  { title: 'AI Tool', category: 'Innovation' },
]
</script>

<style scoped>
.sidebar-right {
  font-family: var(--font-body);
}

.sidebar-widget {
  margin-bottom: var(--spacing-2xl);
  padding-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
}

.sidebar-widget:last-child {
  border-bottom: none;
}

.widget-title {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #111;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid #666;
}

.trending-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.trending-list li {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
}

.trending-list li:last-child {
  border-bottom: none;
}

.rank {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  font-weight: 900;
  color: var(--color-black);
  line-height: 1;
  min-width: 20px;
}

.project-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.project-link {
  font-family: var(--font-heading);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
  line-height: 1.3;
}

.project-link:hover {
  text-decoration: underline;
  background: none;
  color: var(--color-black);
}

.project-meta {
  font-size: 0.65rem;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.widget-text {
  font-size: var(--text-sm);
  color: var(--color-muted);
  margin-bottom: var(--spacing-md);
  line-height: 1.5;
}

.newsletter-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.input-sm {
  padding: 8px 10px;
  font-size: var(--text-xs);
  border: 1px solid var(--color-black);
  background: var(--color-white);
  font-family: var(--font-body);
}

.input-sm:focus {
  outline: none;
  border-color: var(--color-black);
  box-shadow: none;
}

.btn-subscribe {
  background: var(--color-black);
  color: var(--color-white);
  border: 1px solid var(--color-black);
  padding: 8px;
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: var(--font-body);
}

.btn-subscribe:hover {
  background: var(--color-white);
  color: var(--color-black);
}
</style>
