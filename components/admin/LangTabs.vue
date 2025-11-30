<template>
  <div class="lang-tabs">
    <button 
      v-for="lang in languages" 
      :key="lang.code"
      :class="['tab-btn', { active: modelValue === lang.code }]"
      @click="$emit('update:modelValue', lang.code)"
    >
      {{ lang.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: 'en' | 'ko' | 'ja'
}>()

defineEmits<{
  'update:modelValue': [value: 'en' | 'ko' | 'ja']
}>()

const languages = [
  { code: 'en' as const, label: 'EN' },
  { code: 'ko' as const, label: 'KO' },
  { code: 'ja' as const, label: 'JA' }
]
</script>

<style scoped>
.lang-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.tab-btn {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: #888;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tab-btn:hover {
  color: #111;
}

.tab-btn.active {
  color: #111;
  border-bottom-color: #111;
}
</style>
