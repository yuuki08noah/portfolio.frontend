<template>
  <div class="reading-goal-tracker">
    <h2>{{ goal.year }} Reading Goal</h2>
    
    <div class="progress-container">
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: `${progressPercent}%` }"
        />
      </div>
      
      <p class="progress-text">
        {{ goal.currentBooks }} / {{ goal.targetBooks }} books
        ({{ progressPercent }}%)
      </p>
    </div>
    
    <div class="stats">
      <p>Books remaining: {{ goal.targetBooks - goal.currentBooks }}</p>
      <p v-if="averagePerMonth">
        Average per month: {{ averagePerMonth.toFixed(1) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ReadingGoal } from '~/types'

const props = defineProps<{
  goal: ReadingGoal
}>()

const progressPercent = computed(() => {
  return Math.round(props.goal.progress * 100)
})

const averagePerMonth = computed(() => {
  const now = new Date()
  const monthsPassed = now.getMonth() + 1
  return props.goal.currentBooks / monthsPassed
})
</script>

<style scoped>
.reading-goal-tracker {
  background: var(--color-white, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  padding: 24px;
}

.reading-goal-tracker h2 {
  margin: 0 0 16px 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.progress-container {
  margin-bottom: 16px;
}

.progress-bar {
  height: 12px;
  background: var(--color-gray-200, #e5e7eb);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  border-radius: 6px;
  transition: width 0.3s ease;
}

.progress-text {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-muted, #666);
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stats p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-muted, #666);
}
</style>
