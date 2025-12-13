<template>
  <div class="profile-page">
    <div class="portfolio-container">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <p>Loading profile...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
      </div>

      <!-- Profile Content -->
      <template v-else>
        <!-- Header -->
        <header class="profile-header">
          <h1 class="name-title">{{ displayName }}</h1>
          <div class="role-subtitle">
            {{ displayJobPosition }} <span class="separator">|</span> {{ displayCity }}, {{ displayCountry }}
          </div>
          <p class="header-tagline">{{ displayTagline }}</p>
        </header>

        <div class="divider-line"></div>

        <div class="content-wrapper">
          <!-- Main Content (Left) -->
          <main class="main-content">
            <section class="bio-section">
              <h2 class="section-heading">About Me</h2>
              <div class="bio-body" v-html="displayBioHtml"></div>
            </section>

            <div class="divider-short"></div>

            <section v-if="displayValues?.length" class="values-section">
              <h2 class="section-heading">Core Values</h2>
              <div class="values-grid">
                <div v-for="value in displayValues" :key="value.title" class="value-item">
                  <h3 class="value-title">{{ value.title }}</h3>
                  <p class="value-desc">{{ value.description }}</p>
                </div>
              </div>
            </section>
          </main>

          <!-- Sidebar (Right) -->
          <aside class="sidebar">
            <div class="photo-wrapper">
              <img :src="profile.avatar_url || '/images/profile-visual.png'" alt="Profile" class="profile-photo" />
            </div>

            <div class="sidebar-section">
              <h3 class="sidebar-title">Connect</h3>
              <ul class="contact-list">
                <li v-if="profile.email" class="contact-item">
                  <a :href="`mailto:${profile.email}`" class="contact-link">
                    <span class="contact-text">{{ profile.email }}</span>
                  </a>
                </li>
                <li v-if="profile.phone" class="contact-item">
                  <a :href="`tel:${profile.phone}`" class="contact-link">
                    <span class="contact-text">{{ profile.phone }}</span>
                  </a>
                </li>
                <li v-if="profile.github_url" class="contact-item">
                  <a :href="profile.github_url" target="_blank" rel="noopener noreferrer" class="contact-link">
                    <span class="contact-text">GitHub</span>
                  </a>
                </li>
                <li v-if="profile.linkedin_url" class="contact-item">
                  <a :href="profile.linkedin_url" target="_blank" rel="noopener noreferrer" class="contact-link">
                    <span class="contact-text">LinkedIn</span>
                  </a>
                </li>
                <li v-if="profile.website_url" class="contact-item">
                  <a :href="profile.website_url" target="_blank" rel="noopener noreferrer" class="contact-link">
                    <span class="contact-text">Website</span>
                  </a>
                </li>
                <li v-for="link in profile.external_links" :key="link.name" class="contact-item">
                  <a :href="link.url" target="_blank" rel="noopener noreferrer" class="contact-link">
                    <span class="contact-text">{{ link.name }}</span>
                  </a>
                </li>
              </ul>
            </div>

            <div v-if="profile.skills?.length" class="sidebar-section">
              <h3 class="sidebar-title">Skills</h3>
              <div class="skills-list">
                <span v-for="skill in profile.skills" :key="skill" class="skill-item">
                  {{ skill }}
                </span>
              </div>
            </div>

            <div v-if="certs.length" class="sidebar-section">
              <h3 class="sidebar-title">Certifications</h3>
              <div class="cert-list">
                <div v-for="(cert, index) in certs" :key="index" class="cert-entry">
                  <a v-if="cert.url" :href="cert.url" target="_blank" rel="noopener noreferrer" class="cert-name link">
                    {{ cert.name }}
                  </a>
                  <span v-else class="cert-name">{{ cert.name }}</span>
                  <span class="cert-meta">{{ cert.issuer }} &middot; {{ formatDate(cert.date || '') }}</span>
                </div>
              </div>
            </div>

            <div class="sidebar-section">
              <button @click="openTicket" class="resume-btn">
                Download Resume
              </button>
            </div>
          </aside>
        </div>
      </template>
    </div>

    <!-- Resume Ticket Modal -->
    <div v-if="showTicket" class="ticket-modal-backdrop" @click.self="closeTicket">
      <div class="ticket-modal-content">
        <div class="modal-actions">
          <button @click="printTicket" class="btn-primary">Print / Save PDF</button>
          <button @click="closeTicket" class="btn-secondary">Close</button>
        </div>
        <ResumeTicket />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import type { Certification } from '~/types/portfolio'
import ResumeTicket from '~/components/ResumeTicket.vue'
import { useApi } from '~/composables/useApi'

const { locale } = useI18n()

interface ProfileValue {
  title: string
  description: string
}

interface ExternalLink {
  name: string
  url: string
  icon?: string
}

interface ProfileTranslations {
  ko?: {
    name?: string
    bio?: string
    tagline?: string
    job_position?: string
    location_city?: string
    location_country?: string
  }
  ja?: {
    name?: string
    bio?: string
    tagline?: string
    job_position?: string
    location_city?: string
    location_country?: string
  }
}

interface ProfileData {
  id: number
  name: string
  tagline: string
  bio: string
  bio_html?: string
  avatar_url: string
  phone: string
  email: string
  github_url: string
  linkedin_url: string
  twitter_url: string
  website_url: string
  location_country: string
  location_city: string
  job_position: string
  skills: string[]
  values: ProfileValue[]
  external_links: ExternalLink[]
  certifications?: Certification[]
  translations?: ProfileTranslations
}

const { getLocalized } = useApi()

const loading = ref(true)
const error = ref('')
const profile = ref<ProfileData>({
  id: 0,
  name: '',
  tagline: '',
  bio: '',
  avatar_url: '',
  phone: '',
  email: '',
  github_url: '',
  linkedin_url: '',
  twitter_url: '',
  website_url: '',
  location_country: '',
  location_city: '',
  job_position: '',
  skills: [],
  values: [],
  external_links: [],
  translations: {}
})

const certs = computed(() => profile.value.certifications || [])
const showTicket = ref(false)

// 번역된 값 반환 헬퍼
const getTranslated = (field: keyof ProfileData | 'name' | 'bio' | 'tagline' | 'job_position' | 'location_city' | 'location_country') => {
  const koTranslations = profile.value.translations?.ko
  const jaTranslations = profile.value.translations?.ja
  
  if (locale.value === 'ko' && koTranslations && koTranslations[field as keyof typeof koTranslations]) {
    return koTranslations[field as keyof typeof koTranslations]
  }
  if (locale.value === 'ja' && jaTranslations && jaTranslations[field as keyof typeof jaTranslations]) {
    return jaTranslations[field as keyof typeof jaTranslations]
  }
  return profile.value[field as keyof ProfileData]
}

// Computed properties for i18n
const displayName = computed(() => getTranslated('name') as string || '')
const displayTagline = computed(() => getTranslated('tagline') as string || '')
const displayBio = computed(() => getTranslated('bio') as string || '')
const displayBioHtml = computed(() => {
  // bio_html은 번역되지 않고 API에서 현재 locale에 맞게 렌더링된 HTML을 반환함
  return profile.value.bio_html || `<p>${displayBio.value}</p>`
})
const displayJobPosition = computed(() => getTranslated('job_position') as string || 'Full Stack Developer')
const displayCity = computed(() => getTranslated('location_city') as string || 'Seoul')
const displayCountry = computed(() => getTranslated('location_country') as string || 'Korea')
const displayValues = computed(() => profile.value.values || [])

const loadProfile = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await getLocalized<{ profile: ProfileData }>('/portfolio/profile', false)
    if (response?.profile) {
      profile.value = response.profile
    }
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Failed to load profile'
    console.error('Profile load error:', e)
  } finally {
    loading.value = false
  }
}

// locale 변경 감지해서 다시 로드
watch(locale, () => {
  loadProfile()
})

onMounted(loadProfile)

const openTicket = () => {
  showTicket.value = true
}

const closeTicket = () => {
  showTicket.value = false
}

const printTicket = () => {
  globalThis.print()
}

const formatDate = (date: string) => {
  if (!date) return ''
  if (date.includes('~')) return date
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { year: 'numeric' })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Merriweather:wght@300;400;700&family=Inter:wght@400;500;600&display=swap');

.profile-page {
  background-color: #ffffff;
  min-height: 100vh;
  color: #1a1a1a;
  font-family: 'Merriweather', serif;
  padding: var(--spacing-3xl) 0;
}

.portfolio-container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
}

.loading-state,
.error-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-family: 'Inter', sans-serif;
  color: #666;
}

.error-state {
  color: #c00;
}

/* Header */
.profile-header {
  text-align: center;
  margin-top: 40px;
  margin-bottom: 40px;
}

.name-title {
  font-family: 'Playfair Display', serif;
  font-size: 4rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: #111;
  letter-spacing: -1px;
}

.role-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  color: #555;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
}

.separator {
  margin: 0 10px;
  color: #ccc;
}

.header-tagline {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-size: 1.3rem;
  color: #666;
  max-width: 700px;
  margin: 0 auto;
}

.divider-line {
  height: 1px;
  background-color: #e0e0e0;
  margin-bottom: 60px;
}

/* Layout */
.content-wrapper {
  display: grid;
  grid-template-columns: 5fr 2fr;
  gap: 50px;
  align-items: start;
}

/* Main Content */
.section-heading {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 30px;
  color: #111;
}

.bio-body {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
}

.bio-body :deep(p) {
  margin-bottom: 24px;
}

.bio-body :deep(h1) {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  font-weight: 700;
  margin-top: 64px;
  margin-bottom: 24px;
  color: #111;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 12px;
  padding-top: 16px;
}

.bio-body :deep(h2) {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 700;
  margin-top: 64px;
  margin-bottom: 24px;
  color: #111;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 12px;
  padding-top: 16px;
}

.bio-body :deep(h3) {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  font-weight: 600;
  margin-top: 48px;
  margin-bottom: 16px;
  padding-top: 12px;
  color: #222;
}

.bio-body :deep(h4) {
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 40px;
  margin-bottom: 12px;
  padding-top: 12px;
  color: #333;
}

.bio-body :deep(h5) {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 32px;
  margin-bottom: 12px;
  padding-top: 8px;
  color: #444;
}

.bio-body :deep(h6) {
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 12px;
  padding-top: 8px;
  color: #555;
}

.bio-body :deep(ul) {
  list-style: disc;
  padding-left: 40px;
  margin: 24px 0;
}

.bio-body :deep(li) {
  margin-bottom: 12px;
  line-height: 1.6;
}

.bio-body :deep(strong) {
  font-weight: 700;
  color: #111;
}

.bio-body :deep(a) {
  color: #111;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  transition: all 0.2s ease;
}

.bio-body a:hover {
  text-decoration-thickness: 2px;
  color: #000;
}

.divider-short {
  width: 60px;
  height: 2px;
  background-color: #111;
  margin: 50px 0;
}

/* Values */
.values-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.value-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #111;
}

.value-desc {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #555;
}

/* Sidebar */
.sidebar {
  padding-top: 10px;
  flex-shrink: 0;
}

.photo-wrapper {
  margin-bottom: 30px;
}

.profile-photo {
  width: 100%;
  height: auto;
  border-radius: 2px;
}

.sidebar-section {
  margin-bottom: 40px;
}

.sidebar-title {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
  color: #111;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

/* Contact List */
.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.contact-item {
  margin-bottom: 8px;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 15px;
  text-decoration: none;
  color: #666;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  padding: 12px 16px;
  border-radius: 0 4px 4px 0;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-left: 3px solid transparent;
  position: relative;
}

.contact-link:hover {
  color: #111;
  background: linear-gradient(90deg, rgba(0,0,0,0.03) 0%, transparent 100%);
  border-left-color: #111;
  padding-left: 24px;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-item {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #333;
  background: #f5f5f5;
  padding: 6px 12px;
  border-radius: 4px;
}

.cert-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cert-entry {
  display: flex;
  flex-direction: column;
}

.cert-name {
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  font-size: 1rem;
  color: #111;
  margin-bottom: 2px;
  text-decoration: none;
}

.cert-name.link {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
  transition: color 0.2s;
}

.cert-name.link:hover {
  color: #555;
}

.cert-meta {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #777;
}

.resume-btn {
  width: 100%;
  padding: 14px;
  background: #111;
  color: white;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.resume-btn:hover {
  background: #333;
}

/* Responsive */
@media (max-width: 900px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 50px;
  }

  .sidebar {
    order: -1;
  }

  .name-title {
    font-size: 3rem;
  }

  .values-grid {
    grid-template-columns: 1fr;
  }
}

/* Modal */
.ticket-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  backdrop-filter: blur(5px);
}

.ticket-modal-content {
  max-height: 90vh;
  overflow-y: auto;
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.btn-primary, .btn-secondary {
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: #1a1a1a;
  color: white;
}

.btn-secondary {
  background: white;
  color: #1a1a1a;
}

@media print {
  .profile-page {
    background: white;
    padding: 0;
  }
  .portfolio-container {
    padding: 0;
  }
  .profile-header, .sidebar-section:last-child {
    display: none;
  }
  .ticket-modal-backdrop {
    position: static;
    background: none;
    padding: 0;
    display: block;
  }
  .ticket-modal-content {
    max-height: none;
    overflow: visible;
  }
  .modal-actions {
    display: none;
  }
}
</style>
