<template>
  <nav class="social-links">
    <h3 class="section-title">Connect</h3>
    <div class="links-container">
      <a
        v-for="link in links"
        :key="link.name"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="social-link"
        :aria-label="link.name"
      >
        <span class="link-name">{{ link.name }}</span>
        <span class="link-arrow">↗</span>
      </a>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { ExternalLink } from '~/data/portfolio'

defineProps<{
  links: ExternalLink[]
}>()
</script>

<style scoped>
.social-links {
  padding: var(--spacing-xl) 0;
  border-top: 1px solid var(--color-border);
}

.section-title {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  margin-bottom: var(--spacing-lg);
  color: var(--color-text);
}

.links-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.social-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  text-decoration: none;
  color: var(--color-text);
  transition: all var(--transition-base);
  background: var(--color-white);
}

.social-link:hover {
  background: var(--color-text);
  color: var(--color-white);
  border-color: var(--color-text);
}

.link-name {
  font-family: var(--font-body);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.link-arrow {
  font-family: var(--font-body);
}

@media (min-width: 768px) {
  .links-container {
    flex-direction: row;
  }
  
  .social-link {
    flex: 1;
    justify-content: center;
    gap: var(--spacing-sm);
  }
}
</style>
