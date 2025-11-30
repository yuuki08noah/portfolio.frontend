<template>
  <div class="time-slot-selector">
    <label>Time Slot Duration:</label>
    <select :value="modelValue" @change="handleChange">
      <option :value="15">15 minutes</option>
      <option :value="30">30 minutes</option>
      <option :value="60">60 minutes</option>
    </select>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const handleChange = (e: Event) => {
  const target = e.target as HTMLSelectElement
  emit('update:modelValue', Number(target.value))
}
</script>
