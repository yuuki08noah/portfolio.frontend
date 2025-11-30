<template>
  <div class="mypage-container">
    <div class="container">
      <div class="mypage-header">
        <h1 class="page-title">My Page</h1>
        <p class="page-subtitle">Manage your account and settings</p>
      </div>

      <div class="dashboard-grid">
        <!-- Profile Card -->
        <div class="dashboard-card profile-card">
          <div class="card-header">
            <h2>Profile</h2>
            <button class="edit-toggle-btn" @click="toggleEditMode">
              {{ isEditing ? 'Cancel' : 'Edit' }}
            </button>
          </div>
          <div class="card-body">
            <!-- View Mode -->
            <div class="user-info" v-if="!isEditing && user">
              <div class="avatar-placeholder">{{ user.name?.charAt(0) || 'U' }}</div>
              <div class="info-text">
                <h3>{{ user.name || 'User' }}</h3>
                <p>{{ user.email }}</p>
                <p v-if="profile.job_position" class="job-position">{{ profile.job_position }}</p>
                <span class="role-badge">{{ user.role || 'User' }}</span>
              </div>
            </div>

            <!-- Edit Mode -->
            <form v-if="isEditing" class="profile-form" @submit.prevent="handleSaveProfile">
              <div class="form-grid">
                <div class="field">
                  <label for="edit-name">Name</label>
                  <input id="edit-name" v-model="profileForm.name" type="text" required />
                </div>
                <div class="field">
                  <label for="edit-job">Job Position</label>
                  <input id="edit-job" v-model="profileForm.job_position" type="text" placeholder="Full Stack Developer" />
                </div>
                <div class="field">
                  <label for="edit-tagline">Tagline</label>
                  <input id="edit-tagline" v-model="profileForm.tagline" type="text" placeholder="Your professional tagline" />
                </div>
                <div class="field full-width">
                  <label for="edit-bio">Bio</label>
                  <textarea id="edit-bio" v-model="profileForm.bio" rows="3" placeholder="Tell us about yourself..."></textarea>
                </div>
                <div class="field">
                  <label for="edit-country">Country</label>
                  <input id="edit-country" v-model="profileForm.location_country" type="text" placeholder="Korea" />
                </div>
                <div class="field">
                  <label for="edit-city">City</label>
                  <input id="edit-city" v-model="profileForm.location_city" type="text" placeholder="Seoul" />
                </div>
                <div class="field">
                  <label for="edit-phone">Phone</label>
                  <input id="edit-phone" v-model="profileForm.phone" type="tel" placeholder="010-1234-5678" />
                </div>
                <div class="field">
                  <label for="edit-github">GitHub URL</label>
                  <input id="edit-github" v-model="profileForm.github_url" type="url" placeholder="https://github.com/username" />
                </div>
                <div class="field">
                  <label for="edit-linkedin">LinkedIn URL</label>
                  <input id="edit-linkedin" v-model="profileForm.linkedin_url" type="url" placeholder="https://linkedin.com/in/username" />
                </div>
                <div class="field">
                  <label for="edit-website">Website URL</label>
                  <input id="edit-website" v-model="profileForm.website_url" type="url" placeholder="https://example.com" />
                </div>
              </div>

              <!-- Skills -->
              <div class="skills-section">
                <div class="section-header">
                  <label>Skills</label>
                  <button type="button" class="add-btn" @click="addSkill">+ Add</button>
                </div>
                <div class="tags-list">
                  <div v-for="(skill, index) in profileForm.skills" :key="index" class="tag-item">
                    <input v-model="profileForm.skills[index]" type="text" placeholder="Skill" />
                    <button type="button" class="remove-btn" @click="removeSkill(index)">×</button>
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <button type="submit" class="save-btn" :disabled="saving">
                  {{ saving ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
              <p v-if="saveError" class="error-msg">{{ saveError }}</p>
              <p v-if="saveSuccess" class="success-msg">{{ saveSuccess }}</p>
            </form>
          </div>
        </div>

        <!-- Settings Card -->
        <div class="dashboard-card">
          <div class="card-header">
            <h2>Settings</h2>
          </div>
          <div class="card-body">
            <ul class="settings-list">
              <li>
                <button class="setting-btn">Change Password</button>
              </li>
              <li>
                <button class="setting-btn">Notification Preferences</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

const { user } = useAuth()
const { get, put } = useApi()

definePageMeta({
  middleware: ['auth']
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

const isEditing = ref(false)
const saving = ref(false)
const saveError = ref('')
const saveSuccess = ref('')

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

const toggleEditMode = () => {
  if (isEditing.value) {
    // Reset form when canceling
    Object.assign(profileForm, {
      ...profile,
      skills: [...profile.skills]
    })
  }
  isEditing.value = !isEditing.value
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
    saveSuccess.value = 'Profile saved successfully!'
    setTimeout(() => {
      isEditing.value = false
      saveSuccess.value = ''
    }, 1500)
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
.mypage-container {
  min-height: 100vh;
  padding: var(--spacing-3xl) 0;
  background: var(--color-bg);
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.mypage-header {
  margin-bottom: var(--spacing-2xl);
  border-bottom: 2px solid var(--color-text);
  padding-bottom: var(--spacing-lg);
}

.page-title {
  font-family: var(--font-heading);
  font-size: 3rem;
  font-weight: 900;
  color: var(--color-text);
  margin: 0 0 var(--spacing-sm);
}

.page-subtitle {
  font-size: var(--text-lg);
  color: var(--color-muted);
  font-style: italic;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}

.dashboard-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.card-header {
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  font-size: var(--text-lg);
  font-weight: 700;
  margin: 0;
}

.edit-toggle-btn {
  padding: var(--spacing-xs) var(--spacing-md);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: var(--text-sm);
  transition: all 0.2s;
}

.edit-toggle-btn:hover {
  background: var(--color-text);
  color: var(--color-white);
}

.card-body {
  padding: var(--spacing-lg);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.avatar-placeholder {
  width: 64px;
  height: 64px;
  background: var(--color-text);
  color: var(--color-white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
}

.info-text h3 {
  margin: 0 0 var(--spacing-xs);
  font-size: var(--text-xl);
}

.info-text p {
  margin: 0 0 var(--spacing-xs);
  color: var(--color-muted);
}

.job-position {
  font-style: italic;
}

.role-badge {
  display: inline-block;
  padding: 2px 8px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  text-transform: uppercase;
  font-weight: 600;
}

/* Profile Edit Form */
.profile-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.field.full-width {
  grid-column: 1 / -1;
}

.field label {
  font-weight: 600;
  font-size: var(--text-sm);
  color: var(--color-text);
}

.field input,
.field textarea {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-base);
  font-family: inherit;
}

.field textarea {
  resize: vertical;
}

/* Skills Section */
.skills-section {
  border-top: 1px solid var(--color-border);
  padding-top: var(--spacing-md);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.section-header label {
  font-weight: 600;
  font-size: var(--text-sm);
}

.add-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: var(--text-sm);
}

.add-btn:hover {
  background: var(--color-bg);
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.tag-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.tag-item input {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  width: 120px;
}

.remove-btn {
  background: transparent;
  border: 1px solid #f87171;
  color: #dc2626;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: #fef2f2;
}

.form-actions {
  display: flex;
  gap: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.save-btn {
  padding: var(--spacing-sm) var(--spacing-xl);
  background: var(--color-text);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.save-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.error-msg {
  color: #dc2626;
  margin: 0;
  font-size: var(--text-sm);
}

.success-msg {
  color: #15803d;
  margin: 0;
  font-size: var(--text-sm);
}

/* Settings */
.settings-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.setting-btn {
  display: block;
  width: 100%;
  text-align: left;
  padding: var(--spacing-sm) 0;
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  font-size: var(--text-base);
  border-bottom: 1px solid var(--color-border);
}

.setting-btn:hover {
  color: var(--color-accent);
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
