<template>
  <div class="diary-page">
    <section class="diary-hero">
      <div class="container">
        <h1 class="page-title">Travel Diaries</h1>
        <div class="hero-divider"></div>
        <p class="page-subtitle">Documented journeys and memories from around the world.</p>
      </div>
    </section>

    <section class="diary-content">
      <div class="container">
        <div v-if="diaries?.length" class="diary-grid">
          <DiaryCard v-for="diary in diaries" :key="diary.id" :diary="diary" />
        </div>
        <p v-else class="empty-state">No diaries yet. Start documenting your travels.</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import DiaryCard from '~/components/travel/DiaryCard.vue'

const { fetchDiaries } = useTravelDiary()

const { data: diaries } = await useAsyncData('diaries', () =>
  fetchDiaries().then((res) => res.data)
)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Merriweather:wght@300;400;700&family=Inter:wght@400;500;600&display=swap');

.diary-page {
  min-height: 100vh;
  background-color: #fff;
  font-family: 'Merriweather', serif;
}

.diary-hero {
  padding: 100px 0 60px;
  border-bottom: 1px solid #f0f0f0;
}

.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 60px;
}

.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 4rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 30px;
  letter-spacing: -1px;
}

.hero-divider {
  width: 60px;
  height: 2px;
  background-color: #111;
  margin-bottom: 20px;
}

.page-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
}

.diary-content {
  padding: 80px 0 120px;
}

.diary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.empty-state {
  font-family: 'Inter', sans-serif;
  text-align: center;
  color: #999;
  padding: 80px 0;
}

@media (max-width: 1200px) {
  .diary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }

  .diary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
