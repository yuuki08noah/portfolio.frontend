<template>
  <div class="page-wrapper">
    <div class="content-container">
      <header class="page-header">
        <div class="header-top">
          <h1 class="page-title">Admin Dashboard</h1>
          <div class="admin-nav">
            <NuxtLink to="/admin" class="nav-link">Projects</NuxtLink>
            <NuxtLink to="/admin/profile" class="nav-link">Profile</NuxtLink>
            <NuxtLink to="/admin/users" class="nav-link active">Users</NuxtLink>
          </div>
        </div>
        <div class="divider-line"></div>
      </header>

      <div class="content-header">
        <h2 class="section-title">User Management</h2>
        <button class="btn-action">
          <span>+ Invite User</span>
        </button>
      </div>

      <div class="user-list">
        <div class="list-header">
          <div class="col-name">Name</div>
          <div class="col-email">Email</div>
          <div class="col-role">Role</div>
          <div class="col-status">Status</div>
          <div class="col-actions">Actions</div>
        </div>

        <div v-for="user in users" :key="user.id" class="user-item">
          <div class="col-name">
            <div class="user-avatar">
              <img :src="user.avatar || '/images/default-avatar.png'" :alt="user.name" />
            </div>
            <span class="name-text">{{ user.name }}</span>
          </div>
          <div class="col-email">{{ user.email }}</div>
          <div class="col-role">
            <span class="role-badge" :class="user.role.toLowerCase()">{{ user.role }}</span>
          </div>
          <div class="col-status">
            <span class="status-indicator" :class="user.status.toLowerCase()"></span>
            {{ user.status }}
          </div>
          <div class="col-actions">
            <button class="action-btn edit" @click="editUser(user.id)">Edit</button>
            <button class="action-btn delete" @click="deleteUser(user.id)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: response, refresh } = await useFetch('/api/users')
const users = computed(() => response.value?.data || [])

// Placeholder functions for actions
const editUser = (id: number) => {
  console.log('Edit user', id)
}

const deleteUser = async (id: number) => {
  if (confirm('Are you sure you want to delete this user?')) {
    await $fetch(`/api/users/${id}`, { method: 'DELETE' })
    refresh()
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Merriweather:wght@300;400;700&family=Inter:wght@400;500;600&display=swap');

.page-wrapper {
  background-color: #ffffff;
  min-height: 100vh;
  color: #1a1a1a;
  font-family: 'Merriweather', serif;
  padding: 80px 20px;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.page-header {
  margin-bottom: 40px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 20px;
}

.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
  color: #111;
  letter-spacing: -0.5px;
}

.admin-nav {
  display: flex;
  gap: 30px;
}

.nav-link {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #999;
  text-decoration: none;
  padding-bottom: 5px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #111;
}

.nav-link.active {
  color: #111;
  border-bottom: 2px solid #111;
}

.divider-line {
  height: 1px;
  background-color: #e0e0e0;
}

/* Content Header */
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.btn-action {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  background-color: #111;
  border: 1px solid #111;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-action:hover {
  background-color: #fff;
  color: #111;
}

/* User List Table Style */
.user-list {
  display: flex;
  flex-direction: column;
  border-top: 2px solid #111;
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1fr;
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #666;
}

.user-item {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1fr;
  padding: 20px;
  border-bottom: 1px solid #f5f5f5;
  align-items: center;
  transition: background-color 0.2s ease;
}

.user-item:hover {
  background-color: #f9f9f9;
}

/* Columns */
.col-name {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #eee;
  border: 1px solid #ddd;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.name-text {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #111;
}

.col-email {
  font-family: 'Inter', sans-serif;
  color: #555;
  font-size: 0.95rem;
}

.col-role {
  font-family: 'Inter', sans-serif;
}

.role-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.role-badge.admin {
  background-color: #e3f2fd;
  color: #1565c0;
}

.role-badge.editor {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.role-badge.viewer {
  background-color: #f5f5f5;
  color: #616161;
}

.col-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #333;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.active {
  background-color: #4caf50;
}

.status-indicator.inactive {
  background-color: #bdbdbd;
}

.col-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.action-btn {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
}

.action-btn:hover {
  border-color: #111;
  color: #111;
}

.action-btn.delete {
  color: #d32f2f;
  border-color: #ffcdd2;
}

.action-btn.delete:hover {
  background-color: #d32f2f;
  color: #fff;
  border-color: #d32f2f;
}

/* Responsive */
@media (max-width: 1024px) {
  .list-header, .user-item {
    grid-template-columns: 2fr 2fr 1fr 1fr;
  }
  .col-actions {
    display: none; /* Simplify for tablet */
  }
}

@media (max-width: 768px) {
  .header-top {
    flex-direction: column;
    gap: 15px;
  }
  
  .list-header {
    display: none;
  }
  
  .user-item {
    grid-template-columns: 1fr;
    gap: 10px;
    text-align: center;
    padding: 20px;
  }
  
  .col-name {
    flex-direction: column;
    justify-content: center;
  }
  
  .col-status, .col-role {
    justify-content: center;
  }
}
</style>
