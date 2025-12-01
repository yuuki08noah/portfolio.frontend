<template>
  <div class="app-wrapper">
    <header class="site-header">
      <div class="header-top">
        <div class="header-container">
          <NuxtLink to="/" class="site-title">Portfolio</NuxtLink>
          <div class="header-actions">
            <ThemeSelector />
            <button @click="cycleLocale" class="lang-btn" :title="localeTitle">
              {{ localeDisplay }}
            </button>
            <ClientOnly>
              <template v-if="isAuthenticated">
                <NuxtLink to="/mypage" class="auth-link">My Page</NuxtLink>
                <button @click="handleLogout" class="auth-btn">Logout</button>
              </template>
              <template v-else>
                <NuxtLink to="/auth/signin" class="auth-btn">Login</NuxtLink>
              </template>
            </ClientOnly>
          </div>
        </div>
      </div>
      
      <div class="header-nav">
        <div class="header-container">
          <nav class="main-nav">
            <NuxtLink to="/profile">Profile</NuxtLink>
            <NuxtLink to="/projects">Projects</NuxtLink>
            <NuxtLink to="/reading">Reading</NuxtLink>
            <NuxtLink to="/travel">Travel</NuxtLink>
            <NuxtLink to="/blog">Blog</NuxtLink>
            <NuxtLink to="/awards">Awards</NuxtLink>
          </nav>
          <NuxtLink to="/hire" class="hire-btn">Hire Me</NuxtLink>
        </div>
      </div>
    </header>
    
    <main class="site-main">
      <NuxtPage />
    </main>
    
    <footer class="site-footer">
      <div class="footer-content">
        <p>&copy; {{ new Date().getFullYear() }} Portfolio. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
}

.site-header {
  background: var(--color-white);
  position: sticky;
  top: 0;
  z-index: var(--z-nav);
  border-bottom: 4px double var(--color-black);
}

.header-top {
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-sm) 0;
}

/* Consistent container for left alignment */
.header-container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.site-title {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: 900;
  color: var(--color-black);
  text-decoration: none;
  letter-spacing: -0.05em;
  line-height: 1;
  text-transform: uppercase;
}

.site-title:hover {
  text-decoration: none;
  background: none;
  color: var(--color-black);
}

.header-nav {
  padding: var(--spacing-sm) 0;
  background: var(--color-white);
}

/* Navigation aligned to left with hire button on right */
.header-nav .header-container {
  justify-content: space-between; /* Space between nav and hire button */
}

.main-nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  flex-wrap: wrap;
}

.main-nav a {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-black);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: var(--spacing-xs) 0;
  border-bottom: 2px solid transparent;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.main-nav a:hover,
.main-nav a.router-link-active {
  border-bottom-color: var(--color-black);
  background: none;
  color: var(--color-black);
}

/* Hire Me Button */
.hire-btn {
  background: var(--color-black);
  color: var(--color-white);
  border: 2px solid var(--color-black);
  padding: 8px 24px;
  font-size: var(--text-xs);
  font-weight: 700;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.hire-btn:hover {
  background: var(--color-white);
  color: var(--color-black);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.lang-btn {
  background: var(--color-white);
  border: 1px solid var(--color-black);
  padding: 4px 10px;
  font-size: var(--text-xs);
  font-weight: 700;
  cursor: pointer;
  color: var(--color-black);
  transition: all var(--transition-fast);
  font-family: var(--font-body);
  text-transform: uppercase;
}

.lang-btn:hover {
  background: var(--color-black);
  color: var(--color-white);
}

.auth-btn {
  background: var(--color-black);
  color: var(--color-white);
  border: 1px solid var(--color-black);
  padding: 4px 12px;
  font-size: var(--text-xs);
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  transition: all var(--transition-fast);
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.auth-btn:hover {
  background: var(--color-white);
  color: var(--color-black);
}

.auth-link {
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-black);
  text-decoration: underline;
  text-transform: uppercase;
}

.auth-link:hover {
  text-decoration: underline;
  text-decoration-thickness: 2px;
}

.site-main {
  flex: 1;
  background: white;
}

.site-footer {
  background: var(--color-white);
  border-top: 4px double var(--color-black);
  margin-top: var(--spacing-4xl);
}

.footer-content {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--spacing-xl);
  text-align: center;
}

.footer-content p {
  font-size: var(--text-xs);
  color: var(--color-muted);
  font-family: var(--font-body);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
}

@media (max-width: 1024px) {
  .header-container {
    padding: 0 var(--spacing-lg);
  }
  
  .main-nav {
    gap: var(--spacing-md);
  }
}

@media (max-width: 768px) {
  .site-title {
    font-size: var(--text-2xl);
  }
  
  .main-nav {
    gap: var(--spacing-sm);
  }
  
  .main-nav a {
    font-size: 0.65rem;
  }
}
</style>

<script setup lang="ts">
import '~/assets/css/global.css';
import { useI18n } from '~/composables/useI18n';
import ThemeSelector from '~/components/ThemeSelector.vue';

const { locale, setLocale, cycleLocale, t } = useI18n()
const { isAuthenticated, logout } = useAuth()

const localeDisplay = computed(() => {
  switch (locale.value) {
    case 'ko': return 'KO'
    case 'ja': return 'JA'
    default: return 'EN'
  }
})

const localeTitle = computed(() => {
  switch (locale.value) {
    case 'en': return 'Switch to Korean'
    case 'ko': return 'Switch to Japanese'
    case 'ja': return 'Switch to English'
    default: return 'Switch Language'
  }
})

async function handleLogout() {
  await logout()
}
</script>
