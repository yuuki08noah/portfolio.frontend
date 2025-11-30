<template>
  <div class="passport-stamp" :style="stampStyle">
    <div class="stamp-border">
      <div class="stamp-content">
        <span class="stamp-date">{{ formatDate(date) }}</span>
        <span class="stamp-title">{{ title }}</span>
        <span class="stamp-issuer">{{ issuer }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  issuer?: string
  date?: string
  color?: string
  rotation?: number
}>()

const formatDate = (dateString?: string) => {
  if (!dateString) return 'PERMANENT'
  if (dateString.includes('~')) return dateString.split('~')[0].trim()
  return new Date(dateString).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }).toUpperCase()
}

const stampStyle = computed(() => {
  const rotation = props.rotation || (Math.random() * 20 - 10) // Random rotation between -10 and 10 deg
  const color = props.color || ['#d32f2f', '#1976d2', '#388e3c', '#7b1fa2'][Math.floor(Math.random() * 4)]
  
  return {
    transform: `rotate(${rotation}deg)`,
    color: color,
    borderColor: color
  }
})
</script>

<style scoped>
.passport-stamp {
  display: inline-block;
  padding: 8px;
  margin: 10px;
  opacity: 0.85;
  mix-blend-mode: multiply;
  transition: transform 0.3s ease;
}

.passport-stamp:hover {
  transform: scale(1.1) !important;
  opacity: 1;
  z-index: 10;
}

.stamp-border {
  border: 3px double currentColor;
  border-radius: 8px;
  padding: 8px;
  min-width: 120px;
  max-width: 160px;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
}

.stamp-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stamp-date {
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  font-weight: bold;
  border-bottom: 1px solid currentColor;
  padding-bottom: 2px;
}

.stamp-title {
  font-family: sans-serif;
  font-size: 0.9rem;
  font-weight: 900;
  text-transform: uppercase;
  line-height: 1.2;
}

.stamp-issuer {
  font-family: 'Courier New', monospace;
  font-size: 0.65rem;
}
</style>
