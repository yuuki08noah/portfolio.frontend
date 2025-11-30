<template>
  <div class="error-page">
    <div class="error-container">
      <h1 class="error-code">{{ error.statusCode }}</h1>
      <p class="error-message">{{ error.message }}</p>
      <NuxtLink to="/" class="btn-home">Go Home</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  error: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  color: #1a1a1a;
  font-family: 'Inter', sans-serif;
}

.error-container {
  text-align: center;
  padding: 40px;
}

.error-code {
  font-size: 6rem;
  font-weight: 900;
  margin: 0 0 20px;
  color: #111;
}

.error-message {
  font-size: 1.5rem;
  margin: 0 0 40px;
  color: #666;
}

.btn-home {
  display: inline-block;
  padding: 12px 32px;
  background: #111;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-home:hover {
  background: #333;
  transform: translateY(-2px);
}
</style>
