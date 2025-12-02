<template>
  <section class="hero" :style="{ backgroundImage: backgroundImage }">
    <div class="hero-overlay"></div>
    <div class="hero-container">
      <div class="hero-content">
        <div class="hero-eyebrow">{{ currentDate }}</div>
        <h1 class="hero-title">{{ heroTitle }}</h1>
        <p class="hero-subtitle">{{ heroSubtitle }}</p>
        <div class="hero-divider"></div>
        <div class="hero-actions">
          <NuxtLink to="/projects" class="btn btn-primary">
            {{ exploreBtn }}
          </NuxtLink>
          <NuxtLink to="/hire" class="btn btn-outline">
            {{ hireBtn }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from '~/composables/useTheme';

const { getHeroImage } = useTheme();
const { fetchSettings, getSetting } = useSiteSettings();

const { data: settings } = await useAsyncData('site-settings', () =>
  fetchSettings().then(res => res.data)
);

const heroTitle = computed(() => getSetting(settings.value || [], 'hero.title') || 'A Journey to Myself');
const heroSubtitle = computed(() => getSetting(settings.value || [], 'hero.subtitle') || 'Explore my projects and the experiences that shaped my path as a developer.');
const exploreBtn = computed(() => getSetting(settings.value || [], 'hero.explore_btn') || 'Explore Projects');
const hireBtn = computed(() => getSetting(settings.value || [], 'hero.hire_btn') || 'Hire Me');

const currentDate = computed(() => {
  const now = new Date();
  return now.toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

const backgroundImage = computed(() => {
  return `url('${getHeroImage()}')`;
});
</script>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  border-bottom: 1px solid #666; /* Darker gray for visibility */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 400px;
  display: flex;
  align-items: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.85) 50%,
    rgba(255, 255, 255, 0.95) 100%
  );
  z-index: 1;
}

/* Same container as header and content for perfect alignment */
.hero-container {
  position: relative;
  z-index: 2;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--spacing-3xl) var(--spacing-xl);
  width: 100%;
}

.hero-content {
  /* No extra padding or margin - content starts at container edge */
}

.hero-eyebrow {
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-muted);
  margin-bottom: var(--spacing-sm);
}

.hero-title {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.04em;
  color: #111; /* Back to stronger contrast */
  margin-bottom: var(--spacing-md);
  max-width: 900px;
}

.hero-subtitle {
  font-size: var(--text-lg);
  line-height: 1.6;
  color: var(--color-text);
  margin-bottom: var(--spacing-lg);
  max-width: 600px;
}

.hero-divider {
  width: 80px;
  height: 2px; /* Slightly thicker */
  background: #666; /* Visible gray */
  margin-bottom: var(--spacing-xl);
}

.hero-actions {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.btn {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: var(--spacing-sm) var(--spacing-lg);
  text-decoration: none;
  transition: all var(--transition-fast);
  display: inline-block;
}

.btn-primary {
  background: var(--color-black);
  color: var(--color-white);
  border: 2px solid var(--color-black);
}

.btn-primary:hover {
  background: var(--color-white);
  color: var(--color-black);
}

.btn-outline {
  background: var(--color-white);
  color: var(--color-black);
  border: 2px solid var(--color-black);
}

.btn-outline:hover {
  background: var(--color-black);
  color: var(--color-white);
}

@media (max-width: 1024px) {
  .hero-container {
    padding: var(--spacing-2xl) var(--spacing-lg);
  }
}

@media (max-width: 768px) {
  .hero {
    min-height: 350px;
  }
  
  .hero-container {
    padding: var(--spacing-xl) var(--spacing-lg);
  }
  
  .hero-title {
    font-size: var(--text-4xl);
  }
  
  .hero-subtitle {
    font-size: var(--text-base);
  }
}
</style>
