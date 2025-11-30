<template>
  <section class="login-page container-narrow">
    <div class="login-card card">
      <h1>🔐 Login</h1>
      <p class="subtitle">Access your traveler dashboard</p>
      
      <form @submit.prevent="onSubmit" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="your.email@example.com"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="Enter your password"
          />
        </div>
        
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span v-if="!loading">Login</span>
          <span v-else class="loading"></span>
        </button>

        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const { login } = useAuth()

async function onSubmit() {
  loading.value = true
  error.value = ''
  
  try {
    const result = await login(email.value, password.value)

    if (result.success) {
      router.push('/')
    } else {
      error.value = result.error || 'Login failed. Please try again.'
    }
  } catch (e) {
    error.value = 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  padding: var(--spacing-3xl) var(--spacing-md);
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  max-width: 450px;
  width: 100%;
  padding: var(--spacing-2xl);
  text-align: center;
}

.login-card h1 {
  margin-bottom: var(--spacing-sm);
}

.subtitle {
  color: var(--color-gray-600);
  margin-bottom: var(--spacing-xl);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  text-align: left;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-group label {
  font-weight: 600;
  color: var(--color-text);
}

.btn {
  width: 100%;
  padding: var(--spacing-md);
  font-size: 1rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: var(--color-error);
  font-size: 0.9rem;
  margin: 0;
  padding: var(--spacing-sm);
  background: rgba(239, 68, 68, 0.1);
  border-radius: var(--radius-sm);
}
</style>
