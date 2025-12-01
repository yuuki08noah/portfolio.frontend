<template>
  <div class="mypage-wrapper">
    <div class="container">
      <!-- Editorial Header -->
      <header class="editorial-header">
        <div class="header-top">
          <span class="date-display">{{ currentDate }}</span>
          <h1 class="brand-title">MY DASHBOARD</h1>
          <span class="edition-display">Personal Edition</span>
        </div>
        <div class="header-divider"></div>
        <nav class="editorial-nav">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['nav-item', { active: activeTab === tab.id }]"
          >
            {{ tab.label }}
          </button>
        </nav>
        <div class="header-divider-double"></div>
      </header>

      <div class="editorial-layout">
        <!-- Sidebar Column -->
        <aside class="sidebar-column">
          <div class="profile-section">
            <div class="avatar-frame">
              <div class="avatar-img">
                {{ user?.name?.charAt(0).toUpperCase() || 'U' }}
              </div>
            </div>
            <h2 class="profile-name">{{ user?.name || 'User' }}</h2>
            <p class="profile-role">{{ user?.role || 'Contributor' }}</p>
            <p class="profile-email">{{ user?.email }}</p>
            
            <div class="sidebar-divider"></div>
            
            <div class="profile-stats">
              <div class="stat-row">
                <span class="stat-label">Skills</span>
                <span class="stat-value">{{ profile.skills?.length || 0 }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Location</span>
                <span class="stat-value">{{ profile.location_city || 'Unknown' }}</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content Column -->
        <main class="main-column">
          <div class="content-header">
            <h2 class="section-title">
              {{ activeTabLabel }}
            </h2>
            <div class="actions">
              <button v-if="activeTab !== 'settings' && !isEditing" class="btn-text" @click="isEditing = true">
                [ Edit Profile ]
              </button>
              <div v-else-if="isEditing" class="edit-controls">
                <button class="btn-text" @click="cancelEdit">[ Cancel ]</button>
                <button class="btn-solid" @click="handleSaveProfile" :disabled="saving">
                  {{ saving ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </div>
          </div>

          <div class="content-body">
            <!-- Profile Tab -->
            <div v-if="activeTab === 'profile'" class="article-content">
              <form class="editorial-form" @submit.prevent="handleSaveProfile">
                <div class="form-section">
                  <h3 class="subsection-title">General Information</h3>
                  <div class="form-grid">
                    <div class="form-group">
                      <label>Display Name</label>
                      <input v-if="isEditing" v-model="profileForm.name" type="text" class="input-line" />
                      <div v-else class="text-display">{{ profile.name || '—' }}</div>
                    </div>
                    <div class="form-group">
                      <label>Position</label>
                      <input v-if="isEditing" v-model="profileForm.job_position" type="text" class="input-line" />
                      <div v-else class="text-display">{{ profile.job_position || '—' }}</div>
                    </div>
                  </div>
                  <div class="form-group full">
                    <label>Tagline</label>
                    <input v-if="isEditing" v-model="profileForm.tagline" type="text" class="input-line" />
                    <div v-else class="text-display italic">{{ profile.tagline || '—' }}</div>
                  </div>
                  <div class="form-group full">
                    <label>Biography</label>
                    <textarea v-if="isEditing" v-model="profileForm.bio" rows="6" class="input-area"></textarea>
                    <div v-else class="text-display bio-content">{{ profile.bio || '—' }}</div>
                  </div>
                </div>

                <div class="divider-dots"></div>

                <div class="form-section">
                  <h3 class="subsection-title">Contact Details</h3>
                  <div class="form-grid">
                    <div class="form-group">
                      <label>Country</label>
                      <input v-if="isEditing" v-model="profileForm.location_country" type="text" class="input-line" />
                      <div v-else class="text-display">{{ profile.location_country || '—' }}</div>
                    </div>
                    <div class="form-group">
                      <label>City</label>
                      <input v-if="isEditing" v-model="profileForm.location_city" type="text" class="input-line" />
                      <div v-else class="text-display">{{ profile.location_city || '—' }}</div>
                    </div>
                    <div class="form-group">
                      <label>Phone</label>
                      <input v-if="isEditing" v-model="profileForm.phone" type="tel" class="input-line" />
                      <div v-else class="text-display">{{ profile.phone || '—' }}</div>
                    </div>
                  </div>
                </div>

                <div class="divider-dots"></div>

                <div class="form-section">
                  <h3 class="subsection-title">Digital Presence</h3>
                  <div class="link-list">
                    <div class="form-group">
                      <label>GitHub</label>
                      <input v-if="isEditing" v-model="profileForm.github_url" type="url" class="input-line" />
                      <a v-else-if="profile.github_url" :href="profile.github_url" target="_blank" class="link-text">{{ profile.github_url }}</a>
                      <div v-else class="text-display">—</div>
                    </div>
                    <div class="form-group">
                      <label>LinkedIn</label>
                      <input v-if="isEditing" v-model="profileForm.linkedin_url" type="url" class="input-line" />
                      <a v-else-if="profile.linkedin_url" :href="profile.linkedin_url" target="_blank" class="link-text">{{ profile.linkedin_url }}</a>
                      <div v-else class="text-display">—</div>
                    </div>
                    <div class="form-group">
                      <label>Website</label>
                      <input v-if="isEditing" v-model="profileForm.website_url" type="url" class="input-line" />
                      <a v-else-if="profile.website_url" :href="profile.website_url" target="_blank" class="link-text">{{ profile.website_url }}</a>
                      <div v-else class="text-display">—</div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <!-- Skills Tab -->
            <div v-else-if="activeTab === 'skills'" class="article-content">
              <div class="skills-wrapper">
                <div class="skills-intro" v-if="isEditing">
                  <p>Curate your professional expertise. Add skills to your portfolio.</p>
                  <button type="button" class="btn-text-add" @click="addSkill">+ Add New Skill</button>
                </div>

                <div class="skills-list" :class="{ editing: isEditing }">
                  <template v-if="isEditing">
                    <div v-for="(skill, index) in profileForm.skills" :key="index" class="skill-edit-item">
                      <input v-model="profileForm.skills[index]" type="text" class="input-line" placeholder="Skill..." />
                      <button type="button" class="btn-remove" @click="removeSkill(index)">×</button>
                    </div>
                  </template>
                  <template v-else>
                    <span v-for="(skill, index) in profile.skills" :key="index" class="skill-chip">
                      {{ skill }}
                    </span>
                    <div v-if="profile.skills.length === 0" class="empty-text">No skills listed.</div>
                  </template>
                </div>
              </div>
            </div>

            <!-- Settings Tab -->
            <div v-else-if="activeTab === 'settings'" class="article-content">
              <ul class="settings-menu">
                <li class="setting-row">
                  <div class="setting-desc">
                    <h4>Security</h4>
                    <p>Update your password and security preferences.</p>
                  </div>
                  <button class="btn-border">Update</button>
                </li>
                <li class="setting-row">
                  <div class="setting-desc">
                    <h4>Notifications</h4>
                    <p>Manage email alerts and newsletters.</p>
                  </div>
                  <button class="btn-border">Manage</button>
                </li>
                <li class="setting-row danger">
                  <div class="setting-desc">
                    <h4>Danger Zone</h4>
                    <p>Permanently delete your account and data.</p>
                  </div>
                  <button class="btn-border danger">Delete Account</button>
                </li>
              </ul>
            </div>

            <!-- Messages -->
            <div v-if="saveError" class="status-msg error">{{ saveError }}</div>
            <div v-if="saveSuccess" class="status-msg success">{{ saveSuccess }}</div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

const { user } = useAuth()
const { get, put } = useApi()

definePageMeta({
  middleware: ['auth'],
  ssr: true
})

interface ProfileData {
  name: string
  tagline: string
  bio: string
  job_position: string
  location_country: string
  location_city: string
  phone: string
  github_url: string
  linkedin_url: string
  website_url: string
  skills: string[]
}

const tabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'skills', label: 'Expertise' },
  { id: 'settings', label: 'Settings' }
]

const activeTab = ref('profile')
const isEditing = ref(false)
const saving = ref(false)
const saveError = ref('')
const saveSuccess = ref('')

const activeTabLabel = computed(() => {
  return tabs.find(t => t.id === activeTab.value)?.label || 'Profile'
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).toUpperCase()
})

const profile = reactive<ProfileData>({
  name: '',
  tagline: '',
  bio: '',
  job_position: '',
  location_country: '',
  location_city: '',
  phone: '',
  github_url: '',
  linkedin_url: '',
  website_url: '',
  skills: []
})

const profileForm = reactive<ProfileData>({
  name: '',
  tagline: '',
  bio: '',
  job_position: '',
  location_country: '',
  location_city: '',
  phone: '',
  github_url: '',
  linkedin_url: '',
  website_url: '',
  skills: []
})

const loadProfile = async () => {
  try {
    const response = await get<{ profile: ProfileData }>('/api/v1/portfolio/profile')
    if (response?.profile) {
      Object.assign(profile, {
        ...response.profile,
        skills: response.profile.skills || []
      })
      Object.assign(profileForm, {
        ...response.profile,
        skills: [...(response.profile.skills || [])]
      })
    }
  } catch (e) {
    console.error('Failed to load profile:', e)
  }
}

const cancelEdit = () => {
  isEditing.value = false
  Object.assign(profileForm, {
    ...profile,
    skills: [...profile.skills]
  })
  saveError.value = ''
  saveSuccess.value = ''
}

const handleSaveProfile = async () => {
  saving.value = true
  saveError.value = ''
  saveSuccess.value = ''
  try {
    await put('/api/v1/portfolio/profile', profileForm)
    Object.assign(profile, {
      ...profileForm,
      skills: [...profileForm.skills]
    })
    saveSuccess.value = 'Profile updated.'
    setTimeout(() => {
      isEditing.value = false
      saveSuccess.value = ''
    }, 2000)
  } catch (e: unknown) {
    saveError.value = e instanceof Error ? e.message : 'Failed to save profile'
  } finally {
    saving.value = false
  }
}

const addSkill = () => {
  profileForm.skills.push('')
}

const removeSkill = (index: number) => {
  profileForm.skills.splice(index, 1)
}

onMounted(loadProfile)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Inter:wght@400;500;600&display=swap');

.mypage-wrapper {
  min-height: 100vh;
  background-color: #fff;
  color: #111;
  font-family: 'Merriweather', serif;
  padding-bottom: 80px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Header */
.editorial-header {
  padding: 40px 0 0;
  text-align: center;
  margin-bottom: 40px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 16px;
  border-bottom: 1px solid #111;
}

.date-display, .edition-display {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #666;
}

.brand-title {
  font-family: 'Playfair Display', serif;
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0;
  line-height: 1;
  letter-spacing: -1px;
}

.header-divider {
  height: 1px;
  background: #111;
  margin-bottom: 2px;
}

.header-divider-double {
  height: 3px;
  background: #111;
  border-top: 1px solid #fff;
}

.editorial-nav {
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 12px 0;
}

.nav-item {
  background: none;
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #999;
  cursor: pointer;
  padding: 4px 0;
  transition: color 0.2s;
}

.nav-item:hover, .nav-item.active {
  color: #111;
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* Layout */
.editorial-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
  border-top: 1px solid #111;
  padding-top: 40px;
}

/* Sidebar */
.sidebar-column {
  border-right: 1px solid #e5e5e5;
  padding-right: 40px;
}

.profile-section {
  text-align: center;
}

.avatar-frame {
  width: 120px;
  height: 120px;
  margin: 0 auto 24px;
  border: 1px solid #111;
  padding: 4px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  color: #111;
}

.profile-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 8px;
}

.profile-role {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #666;
  margin: 0 0 4px;
}

.profile-email {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #999;
  margin: 0 0 24px;
}

.sidebar-divider {
  width: 40px;
  height: 1px;
  background: #111;
  margin: 0 auto 24px;
}

.profile-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
}

.stat-label {
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #666;
}

.stat-value {
  font-weight: 600;
  color: #111;
}

/* Main Content */
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 40px;
  border-bottom: 4px solid #111;
  padding-bottom: 16px;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  font-style: italic;
}

.btn-text {
  background: none;
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #111;
  cursor: pointer;
}

.btn-text:hover {
  text-decoration: underline;
}

.edit-controls {
  display: flex;
  gap: 16px;
  align-items: center;
}

.btn-solid {
  background: #111;
  color: #fff;
  border: 1px solid #111;
  padding: 8px 16px;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-solid:hover:not(:disabled) {
  background: #fff;
  color: #111;
}

.btn-solid:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Forms */
.editorial-form {
  max-width: 800px;
}

.subsection-title {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 24px;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 8px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
  margin-bottom: 32px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full {
  grid-column: 1 / -1;
  margin-bottom: 32px;
}

.form-group label {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #666;
}

.input-line {
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 8px 0;
  font-family: 'Merriweather', serif;
  font-size: 1rem;
  color: #111;
  background: transparent;
  transition: border-color 0.2s;
  border-radius: 0;
}

.input-line:focus {
  outline: none;
  border-bottom-color: #111;
}

.input-area {
  border: 1px solid #ccc;
  padding: 16px;
  font-family: 'Merriweather', serif;
  font-size: 1rem;
  line-height: 1.6;
  resize: vertical;
  background: #f9f9f9;
}

.input-area:focus {
  outline: none;
  border-color: #111;
  background: #fff;
}

.text-display {
  padding: 8px 0;
  font-size: 1.1rem;
  color: #111;
  border-bottom: 1px solid transparent;
}

.text-display.italic {
  font-style: italic;
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
}

.text-display.bio-content {
  line-height: 1.8;
  color: #333;
}

.link-text {
  padding: 8px 0;
  font-size: 1rem;
  color: #111;
  text-decoration: underline;
  text-decoration-color: #ccc;
  text-underline-offset: 4px;
}

.link-text:hover {
  text-decoration-color: #111;
}

.divider-dots {
  text-align: center;
  margin: 40px 0;
}

.divider-dots::after {
  content: '• • •';
  font-size: 1.5rem;
  color: #ccc;
  letter-spacing: 8px;
}

/* Skills */
.skills-intro {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px;
  background: #f9f9f9;
  border: 1px solid #e5e5e5;
}

.btn-text-add {
  background: none;
  border: 1px solid #111;
  padding: 8px 16px;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  margin-top: 16px;
  transition: all 0.2s;
}

.btn-text-add:hover {
  background: #111;
  color: #fff;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.skills-list.editing {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.skill-chip {
  padding: 8px 16px;
  border: 1px solid #111;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.skill-edit-item {
  display: flex;
  gap: 8px;
}

.btn-remove {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #999;
}

.btn-remove:hover {
  color: #d00;
}

/* Settings */
.settings-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid #e5e5e5;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 0;
  border-bottom: 1px solid #e5e5e5;
}

.setting-desc h4 {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  margin: 0 0 8px;
}

.setting-desc p {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.btn-border {
  background: none;
  border: 1px solid #111;
  padding: 8px 24px;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-border:hover {
  background: #111;
  color: #fff;
}

.btn-border.danger {
  border-color: #d00;
  color: #d00;
}

.btn-border.danger:hover {
  background: #d00;
  color: #fff;
}

/* Status Messages */
.status-msg {
  margin-top: 24px;
  padding: 16px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid;
}

.status-msg.success {
  border-color: #111;
  background: #f0fdf4;
}

.status-msg.error {
  border-color: #d00;
  color: #d00;
  background: #fff5f5;
}

/* Responsive */
@media (max-width: 900px) {
  .editorial-layout {
    grid-template-columns: 1fr;
  }
  
  .sidebar-column {
    border-right: none;
    border-bottom: 1px solid #e5e5e5;
    padding-right: 0;
    padding-bottom: 40px;
    margin-bottom: 40px;
  }
  
  .header-top {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  
  .brand-title {
    font-size: 2.5rem;
  }
}
</style>
