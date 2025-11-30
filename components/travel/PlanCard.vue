<template>
  <NuxtLink :to="`/travel/plan/${plan.id}`" class="plan-card">
    <div class="header">
      <h3>{{ displayCity }}, {{ displayCountry }}</h3>
      <span class="status-badge" :class="plan.status">{{ plan.status }}</span>
    </div>
    
    <div class="details">
      <p v-if="plan.targetDate">Target Date: {{ formatDate(plan.targetDate) }}</p>
      <p v-if="plan.duration">Duration: {{ plan.duration }} days</p>
      <p v-if="plan.budget">
        Budget: {{ plan.budget.amount }} {{ plan.budget.currency }}
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
  plan: TravelPlan
}>()

const { t } = useI18n()

const displayCity = computed(() => t(
  props.plan.destination.city,
  props.plan.translations?.ko?.destination_city,
  props.plan.translations?.ja?.destination_city
))
const displayCountry = computed(() => t(
  props.plan.destination.country,
  props.plan.translations?.ko?.destination_country,
  props.plan.translations?.ja?.destination_country
))

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const completedItems = computed(() => 
  props.plan.checklist?.filter(item => item.completed).length || 0
)

const totalItems = computed(() => props.plan.checklist?.length || 0)
</script>
