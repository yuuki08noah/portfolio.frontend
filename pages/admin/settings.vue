<template>
  <AdminLayout title="Site Settings" subtitle="Manage hero banner and site-wide content">
    <div v-if="loading" class="loading">Loading settings...</div>

    <form v-else @submit.prevent="saveSettings" class="settings-form">
      <!-- Hero Section -->
      <section class="settings-section">
        <h2>Hero Banner</h2>
        
        <div class="form-grid">
          <div class="form-group" v-if="form['hero.title']">
            <label for="hero-title-en">Title (EN)</label>
            <input id="hero-title-en" v-model="form['hero.title'].value" type="text" placeholder="Enter English title" />
          </div>
          <div class="form-group" v-if="form['hero.title']">
            <label for="hero-title-ko">Title (KO)</label>
            <input id="hero-title-ko" v-model="form['hero.title'].valueKo" type="text" placeholder="Enter Korean title" />
          </div>

          <div class="form-group full-width" v-if="form['hero.subtitle']">
            <label for="hero-subtitle-en">Subtitle (EN)</label>
            <textarea id="hero-subtitle-en" v-model="form['hero.subtitle'].value" rows="3" placeholder="Enter English subtitle"></textarea>
          </div>
          <div class="form-group full-width" v-if="form['hero.subtitle']">
            <label for="hero-subtitle-ko">Subtitle (KO)</label>
            <textarea id="hero-subtitle-ko" v-model="form['hero.subtitle'].valueKo" rows="3" placeholder="Enter Korean subtitle"></textarea>
          </div>

          <div class="form-group" v-if="form['hero.explore_btn']">
            <label for="hero-explore-en">Explore Button (EN)</label>
            <input id="hero-explore-en" v-model="form['hero.explore_btn'].value" type="text" />
          </div>
          <div class="form-group" v-if="form['hero.explore_btn']">
            <label for="hero-explore-ko">Explore Button (KO)</label>
            <input id="hero-explore-ko" v-model="form['hero.explore_btn'].valueKo" type="text" />
          </div>

          <div class="form-group" v-if="form['hero.hire_btn']">
            <label for="hero-hire-en">Hire Button (EN)</label>
            <input id="hero-hire-en" v-model="form['hero.hire_btn'].value" type="text" />
          </div>
          <div class="form-group" v-if="form['hero.hire_btn']">
            <label for="hero-hire-ko">Hire Button (KO)</label>
            <input id="hero-hire-ko" v-model="form['hero.hire_btn'].valueKo" type="text" />
          </div>
        </div>
      </section>

      <div class="form-actions">
        <button type="submit" class="btn-save" :disabled="saving">
          {{ saving ? 'Saving Changes...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '~/components/admin/AdminLayout.vue'

definePageMeta({
  middleware: ['auth'],
  ssr: true
})

const { fetchSettings, bulkUpdateSettings } = useSiteSettings()

const loading = ref(true)
const saving = ref(false)

const defaultSettings = {
  'hero.title': { value: '', valueKo: '' },
  'hero.subtitle': { value: '', valueKo: '' },
  'hero.explore_btn': { value: '', valueKo: '' },
  'hero.hire_btn': { value: '', valueKo: '' },
}

const form = ref<Record<string, { value: string; valueKo: string }>>({ ...defaultSettings })

onMounted(async () => {
  try {
    const { data } = await fetchSettings()
    data.forEach((setting: any) => {
      if (form.value[setting.key]) {
        form.value[setting.key] = {
          value: setting.value || '',
          valueKo: setting.valueKo || ''
        }
      }
    })
  } catch (e) {
    console.error('Failed to load settings', e)
  } finally {
    loading.value = false
  }
})

const saveSettings = async () => {
  saving.value = true
  try {
    const settings = Object.entries(form.value).map(([key, val]) => ({
      key,
      value: val.value,
      value_ko: val.valueKo
    }))
    await bulkUpdateSettings(settings)
    alert('Settings saved successfully!')
  } catch (e) {
    console.error('Failed to save settings', e)
    alert('Failed to save settings')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.admin-settings {
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 60px;
  text-align: center;
}

.page-header h1 {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: #111;
}

.subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.settings-form {
  background: #fff;
}

.settings-section {
  margin-bottom: 60px;
  padding-bottom: 60px;
  border-bottom: 1px solid #f0f0f0;
}

.settings-section:last-child {
  border-bottom: none;
}

.settings-section h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 0 30px 0;
  color: #111;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
  color: #444;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 16px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #111;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #111;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.form-actions {
  position: sticky;
  bottom: 40px;
  background: #fff;
  padding: 20px;
  border: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  box-shadow: 0 -10px 30px rgba(0,0,0,0.05);
  z-index: 10;
}

.btn-save {
  background: #111;
  color: #fff;
  border: 1px solid #111;
  padding: 16px 40px;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-radius: 4px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.btn-save:hover:not(:disabled) {
  background: #fff;
  color: #111;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 100px;
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: #999;
  font-style: italic;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header h1 {
    font-size: 2.5rem;
  }
}
</style>
