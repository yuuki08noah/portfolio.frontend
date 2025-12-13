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
  border-right: 1px solid rgba(0,0,0,0.06);
  height: 100%;
  padding-right: var(--spacing-xl);
}

.sidebar-section {
  margin-bottom: var(--spacing-3xl);
}

.sidebar-title {
  font-family: var(--font-heading);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #999;
  margin-bottom: 24px;
  padding-bottom: 8px;
  border-bottom: 2px solid #000;
  display: inline-block;
  min-width: 60px;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-list li {
  margin: 0;
}

.nav-list a {
  font-family: var(--font-heading);
  font-size: 15px;
  font-weight: 600;
  color: #666;
  text-decoration: none;
  display: block;
  padding: 10px 16px;
  border-left: 3px solid transparent;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background: transparent;
  border-radius: 0 4px 4px 0;
}

.nav-list a:hover {
  color: #000;
  background: rgba(0,0,0,0.03);
  padding-left: 20px;
}

.nav-list a.active {
  color: #000;
  border-left-color: #000;
  background: rgba(0,0,0,0.05);
  padding-left: 20px;
  font-weight: 700;
}
</style>
