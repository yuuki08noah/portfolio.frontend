<template>
  <section class="hire-page container-narrow">
    <div class="hire-card card">
      <h1>Hire Me — Book an Interview</h1>
      <p class="subtitle">Let's discuss how we can work together</p>
      
      <form @submit.prevent="onSubmit" class="hire-form">
        <div class="form-group">
          <label for="name">Name *</label>
          <input
            id="name"
            v-model="form.name"
            required
            placeholder="Your full name"
          />
        </div>
        
        <div class="form-group">
          <label for="company">Company</label>
          <input
            id="company"
            v-model="form.company"
            placeholder="Your company (optional)"
          />
        </div>
        
        <div class="form-group">
          <label for="email">Email *</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="your.email@example.com"
          />
        </div>
        
        <div class="form-group">
          <label for="message">Message</label>
          <textarea
            id="message"
            v-model="form.message"
            rows="4"
            placeholder="Tell me about the opportunity..."
          />
        </div>
        
        <div class="form-group">
          <label for="schedule">Preferred Date/Time *</label>
          <input
            id="schedule"
            v-model="form.scheduleISO"
            type="datetime-local"
            required
          />
        </div>
        
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span v-if="!loading">Send Request</span>
          <span v-else class="loading"></span>
        </button>

        <p v-if="status" :class="['status-message', statusType]">
          {{ status }}
        </p>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const form = reactive({
  name: '',
  company: '',
  email: '',
  message: '',
  scheduleISO: ''
});

const loading = ref(false);
const status = ref('');
const statusType = ref<'success' | 'error'>('success');

async function onSubmit() {
  loading.value = true;
  status.value = '';
  
  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.backendApiBase as string
    const response = await $fetch(`${apiBase}/api/v1/hire`, {
      method: 'POST',
      body: form
    });
    
    statusType.value = 'success';
    status.value = 'Request sent successfully! I will get back to you soon.';
    
    // Reset form
    form.name = '';
    form.company = '';
    form.email = '';
    form.message = '';
    form.scheduleISO = '';
  } catch (error: any) {
    statusType.value = 'error';
    status.value = error.data?.message || 'Failed to send request. Please try again.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.hire-page {
  padding: var(--spacing-3xl) var(--spacing-md);
  min-height: 60vh;
}

.hire-card {
  max-width: 600px;
  width: 100%;
  padding: var(--spacing-2xl);
  margin: 0 auto;
}

.hire-card h1 {
  text-align: center;
  margin-bottom: var(--spacing-sm);
}

.subtitle {
  text-align: center;
  color: var(--color-gray-600);
  margin-bottom: var(--spacing-xl);
}

.hire-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
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

.status-message {
  text-align: center;
  font-size: 0.9rem;
  margin: 0;
  padding: var(--spacing-md);
  border-radius: var(--radius-sm);
}

.status-message.success {
  color: var(--color-success);
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid var(--color-success);
}

.status-message.error {
  color: var(--color-error);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--color-error);
}
</style>