<template>
  <div class="auth-page" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <div class="auth-overlay"></div>
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <NuxtLink to="/" class="back-link">← Back to Home</NuxtLink>
          <h1 class="auth-title">Create Account</h1>
          <p class="auth-subtitle">Start your journey with us</p>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-group">
            <label for="name" class="form-label">Name</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              class="form-input"
              placeholder="Your Name"
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="form-input"
              placeholder="your@email.com"
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              required
              minlength="8"
              class="form-input"
              placeholder="••••••••"
              :disabled="loading"
            />
            <span class="form-hint">At least 8 characters</span>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="formData.agreeToTerms" type="checkbox" required />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </label>
          </div>

          <button type="submit" class="submit-btn" :disabled="loading || !formData.agreeToTerms">
            {{ loading ? 'Creating account...' : 'Sign Up' }}
          </button>

          <div class="auth-footer">
            <span>Already have an account?</span>
            <NuxtLink to="/auth/signin" class="auth-link">Sign In</NuxtLink>
          </div>
        </form>
      </div>
    </div>
    
    <Toast 
      :show="showToast" 
      :message="toastMessage" 
      :type="toastType"
      @close="showToast = false" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '~/composables/useTheme'

definePageMeta({
  layout: false,
  ssr: true
})

const router = useRouter()
const { signup } = useAuth()
const { getHeroImage } = useTheme()

const formData = reactive({
  name: '',
  email: '',
  password: '',
  agreeToTerms: false
})

const loading = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'error' | 'success'>('error')

const backgroundImage = computed(() => getHeroImage())

const getErrorMessage = (error: string) => {
  if (error.includes('already been taken')) {
    return 'This email is already registered. Try signing in instead.'
  }
  if (error.includes('Password')) {
    return 'Password must be at least 8 characters.'
  }
  return 'Something went wrong. Please try again.'
}

const handleSubmit = async () => {
  loading.value = true

  const result = await signup(formData.email, formData.password, formData.name)

  if (result.success) {
    router.push('/')
  } else {
    toastMessage.value = getErrorMessage(result.error || '')
    toastType.value = 'error'
    showToast.value = true
  }

  loading.value = false
}
</script>

<style scoped>
.auth-page {
  position: fixed;
  inset: 0;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.85) 30%,
    rgba(255, 255, 255, 0.6) 60%,
    rgba(255, 255, 255, 0.2) 100%
  );
}

.auth-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 520px;
  padding: var(--spacing-md);
  margin-top: 5%;
}

.auth-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-md);
  padding: var(--spacing-2xl);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 520px;
}

.auth-header {
  margin-bottom: var(--spacing-2xl);
}

.back-link {
  display: inline-block;
  font-size: var(--text-base);
  color: var(--color-muted);
  text-decoration: none;
  margin-bottom: var(--spacing-lg);
  transition: color var(--transition-fast);
}

.back-link:hover {
  color: var(--color-text);
}

.auth-title {
  font-family: var(--font-heading);
  font-size: 2.75rem;
  font-weight: 900;
  color: var(--color-text);
  margin: 0 0 var(--spacing-sm);
  letter-spacing: -0.02em;
}

.auth-subtitle {
  font-size: var(--text-lg);
  color: var(--color-muted);
  font-style: italic;
  margin: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  position: relative;
}

.form-label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
}

.form-input {
  padding: var(--spacing-md) var(--spacing-md);
  border: none;
  border-bottom: 2px solid var(--color-border);
  border-radius: 0;
  font-size: var(--text-lg);
  font-family: var(--font-body);
  transition: all 0.3s ease;
  background: transparent;
}

.form-input:focus {
  outline: none;
  border-bottom-color: var(--color-text);
  box-shadow: none;
  background: rgba(0, 0, 0, 0.02);
}

.form-input::placeholder {
  color: var(--color-border);
  font-style: italic;
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-hint {
  font-size: var(--text-sm);
  color: var(--color-muted);
  font-style: italic;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-size: var(--text-base);
  line-height: 1.5;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin-top: 2px;
  flex-shrink: 0;
}

.submit-btn {
  padding: var(--spacing-lg) var(--spacing-xl);
  background: var(--color-text);
  color: var(--color-white);
  border: 2px solid var(--color-text);
  border-radius: var(--radius-sm);
  font-size: var(--text-lg);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-top: var(--spacing-md);
}

.submit-btn:hover:not(:disabled) {
  background: var(--color-white);
  color: var(--color-text);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  font-size: var(--text-base);
  color: var(--color-muted);
  margin-top: var(--spacing-lg);
}

.auth-link {
  color: var(--color-text);
  font-weight: 700;
  text-decoration: none;
  margin-left: var(--spacing-xs);
}

.auth-link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .auth-container {
    padding: var(--spacing-md);
  }
  
  .auth-card {
    padding: var(--spacing-xl);
  }
  
  .auth-title {
    font-size: 1.75rem;
  }
}
</style>
