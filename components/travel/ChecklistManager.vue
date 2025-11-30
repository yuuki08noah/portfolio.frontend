<template>
  <div class="checklist-manager">
    <h3>Checklist</h3>
    
    <div v-for="item in items" :key="item.id" class="checklist-item">
      <input
        :id="`check-${item.id}`"
        v-model="item.completed"
        type="checkbox"
        @change="$emit('update-item', item)"
      />
      <label :for="`check-${item.id}`" :class="{ completed: item.completed }">
        {{ item.task }}
      </label>
      <span class="category-badge">{{ item.category }}</span>
      <button @click="$emit('delete-item', item.id)" class="delete-btn">×</button>
    </div>
    
    <button @click="$emit('add-item')" class="add-btn">+ Add Item</button>
  </div>
</template>

<script setup lang="ts">
import type { ChecklistItem } from '~/types'

defineProps<{
  items: ChecklistItem[]
}>()

defineEmits<{
  'update-item': [item: ChecklistItem]
  'delete-item': [id: string]
  'add-item': []
}>()
</script>
