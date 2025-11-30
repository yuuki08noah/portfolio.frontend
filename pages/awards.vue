<template>
  <div class="page-wrapper">
    <div class="content-container">
      <header class="page-header">
        <h1 class="page-title">Awards</h1>
      </header>

      <div class="divider-line"></div>

      <div v-if="loading" class="loading">Loading awards...</div>
      <div v-else-if="awardsList.length === 0" class="empty">No awards yet.</div>
      <div v-else class="awards-list">
        <article v-for="award in awardsList" :key="award.id" class="award-item">
          <div class="award-meta">
            <span class="award-date">{{ award.date }}</span>
            <span class="award-org">{{ award.organization }}</span>
          </div>
          
          <div class="award-content">
            <h2 class="award-title">{{ award.title }}</h2>
            <p v-if="award.description" class="award-desc">{{ award.description }}</p>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import useProfile from '~/composables/useProfile'

interface Award {
  id: number
  title: string
  organization: string
  date: string
  description?: string
  badge_image?: string
}

const { fetchAwards } = useProfile()
const route = useRoute()
const awardsList = ref<Award[]>([])
const loading = ref(true)

const loadAwards = async () => {
  loading.value = true
  try {
    const response = await fetchAwards()
    awardsList.value = response.awards || []
  } catch (e) {
    console.error('Failed to load awards:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAwards()
})

watch(() => route.params.locale, () => {
  loadAwards()
})
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
  max-width: 1200px; /* Increased from 900px */
  margin: 0 auto;
}

/* Header */
.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0 0 15px 0;
  color: #111;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  color: #666;
  font-weight: 400;
  letter-spacing: 0.5px;
}

.divider-line {
  height: 1px;
  background-color: #e0e0e0;
  margin-bottom: 60px;
}

.loading, .empty {
  text-align: center;
  padding: 60px 20px;
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  color: #999;
}

/* Awards List */
.awards-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.award-item {
  display: grid;
  grid-template-columns: 180px 1fr; /* Adjusted column width */
  gap: 60px; /* Increased gap for better separation */
  padding: 40px; /* Increased padding */
  border-radius: 0 4px 4px 0;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-left: 3px solid transparent;
  position: relative;
}

.award-item:hover {
  background: linear-gradient(90deg, rgba(0,0,0,0.02) 0%, transparent 100%);
  border-left-color: #111;
  padding-left: 50px; /* Enhanced slide effect */
}

/* Meta Column */
.award-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: right;
  padding-top: 5px; /* Align with title */
}

.award-date {
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem; /* Larger date */
  font-weight: 600;
  color: #111;
}

.award-org {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.4;
}

/* Content Column */
.award-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.award-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem; /* Larger title */
  font-weight: 600;
  color: #111;
  margin: 0;
  line-height: 1.2;
}

.award-desc {
  font-family: 'Merriweather', serif;
  font-size: 1.05rem; /* Slightly larger text */
  color: #444;
  line-height: 1.7; /* Better readability */
  margin: 0;
  max-width: 800px; /* Optimal reading width */
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }

  .award-item {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 20px;
  }

  .award-meta {
    text-align: left;
    flex-direction: row;
    align-items: center;
    gap: 15px;
  }
  
  .award-org::before {
    content: "•";
    margin-right: 15px;
    color: #ccc;
  }

  .award-item:hover {
    padding-left: 30px;
  }
}
</style>
