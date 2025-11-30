<template>
  <form class="plan-editor" @submit.prevent="handleSubmit">
    <div class="destination-inputs">
      <input v-model="plan.destination.country" type="text" placeholder="Country" required />
      <input v-model="plan.destination.city" type="text" placeholder="City" required />
    </div>
    
    <div class="date-inputs">
      <input v-model="plan.targetDate" type="date" />
      <input v-model.number="plan.duration" type="number" placeholder="Duration (days)" />
    </div>
    
    <div class="budget-inputs">
      <input v-model.number="budgetAmount" type="number" placeholder="Budget" />
      <input v-model="budgetCurrency" type="text" placeholder="Currency" />
    </div>
    
    <select v-model="plan.status">
      <option value="planning">Planning</option>
      <option value="booked">Booked</option>
      <option value="completed">Completed</option>
      <option value="cancelled">Cancelled</option>
    </select>
    
    <textarea v-model="plan.notes" placeholder="Notes" rows="4" />
    
    <button type="submit" class="submit-btn">Save Plan</button>
  </form>
</template>

<script setup lang="ts">
import type { TravelPlan } from '~/types'

const props = defineProps<{
  initialPlan?: Partial<TravelPlan>
}>()

const emit = defineEmits<{
  submit: [plan: Partial<TravelPlan>]
}>()

const budgetAmount = ref(props.initialPlan?.budget?.amount || 0)
const budgetCurrency = ref(props.initialPlan?.budget?.currency || 'USD')

const plan = reactive<Partial<TravelPlan>>({
  destination: {
    country: '',
    city: '',
    countryCode: ''
  },
  status: 'planning',
  checklist: [],
  bucketList: [],
  timeSlotDuration: 30,
  ...props.initialPlan
})

const handleSubmit = () => {
  plan.budget = {
    amount: budgetAmount.value,
    currency: budgetCurrency.value
  }
  emit('submit', plan)
}
</script>
