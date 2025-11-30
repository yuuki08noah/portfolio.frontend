<template>
  <aside class="sidebar-left">
    <nav class="sidebar-section">
      <h3 class="sidebar-title">Index</h3>
      <ul class="nav-list">
        <li><NuxtLink to="/" active-class="active">Front Page</NuxtLink></li>
        <li><NuxtLink to="/profile" active-class="active">Profile</NuxtLink></li>
        <li><NuxtLink to="/projects" active-class="active">Projects</NuxtLink></li>
        <li><NuxtLink to="/awards" active-class="active">Awards</NuxtLink></li>
        <li><NuxtLink to="/hire" active-class="active">Hire</NuxtLink></li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar-left {
  font-family: var(--font-body);
}

.sidebar-section {
  margin-bottom: var(--spacing-xl);
}

.sidebar-title {
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

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list li {
  margin-bottom: var(--spacing-xs);
}

.nav-list a {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text);
  text-decoration: none;
  display: block;
  padding: var(--spacing-xs) 0;
  border-bottom: 1px solid transparent;
  transition: all var(--transition-fast);
}

.nav-list a:hover,
.nav-list a.active {
  color: var(--color-black);
  border-bottom-color: var(--color-black);
  background: none;
  padding-left: var(--spacing-xs);
}
</style>
