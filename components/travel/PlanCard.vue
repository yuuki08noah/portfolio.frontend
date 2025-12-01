<template>
  <NuxtLink :to="`/travel/plan/${plan.id}`" class="plan-card">
    <div class="header">
      <h3>{{ displayCity }}, {{ displayCountry }}</h3>
      <span class="status-badge" :class="plan.status">{{ plan.status }}</span>
    </div>
    
    <div class="details">
      <p v-if="targetDate">Target Date: {{ formatDate(targetDate) }}</p>
      <p v-if="plan.duration">Duration: {{ plan.duration }} days</p>
      <p v-if="budget">
        Budget: {{ budget.amount }} {{ budget.currency }}
      </p>
    </div>
    
    <div class="progress">
      <p>Checklist: {{ completedItems }}/{{ totalItems }}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { TravelPlan } from '~/types'

const props = defineProps<{
  plan: TravelPlan & {
    target_date?: string
  }
}>()

const { t } = useI18n()

const displayCity = computed(() => t(
  props.plan.destination?.city || '',
  props.plan.translations?.ko?.destination_city,
  props.plan.translations?.ja?.destination_city
))
const displayCountry = computed(() => t(
  props.plan.destination?.country || '',
  props.plan.translations?.ko?.destination_country,
  props.plan.translations?.ja?.destination_country
))

const targetDate = computed(() => props.plan.target_date || props.plan.targetDate)
const budget = computed(() => props.plan.budget)

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

const checklist = computed(() => {
  const list = props.plan.checklist
  if (Array.isArray(list)) return list
  if (list && typeof list === 'object') return Object.values(list)
  return []
})

const completedItems = computed(() => 
  checklist.value.filter((item: any) => item?.completed).length || 0
)

const totalItems = computed(() => checklist.value.length || 0)
</script>

<style scoped>
.plan-card {
  display: block;
  text-decoration: none;
  color: inherit;
  background: #fff;
  border: 1px solid #e5e5e5;
  padding: 30px;
  transition: all 0.3s ease;
}

.plan-card:hover {
  border-color: #111;
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.header h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111;
  margin: 0;
  line-height: 1.3;
}

.status-badge {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 6px 12px;
  border-radius: 2px;
}

.status-badge.planning {
  background: #f5f5f5;
  color: #666;
}

.status-badge.booked {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.completed {
  background: #e3f2fd;
  color: #1565c0;
}

.status-badge.cancelled {
  background: #ffebee;
  color: #c62828;
}

.details {
  margin-bottom: 20px;
}

.details p {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 8px;
}

.details p:last-child {
  margin-bottom: 0;
}

.progress {
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.progress p {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #999;
  margin: 0;
}
</style>
