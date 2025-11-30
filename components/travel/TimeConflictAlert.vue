<template>
  <div v-if="hasConflict" class="time-conflict-alert">
    <span class="icon">⚠️</span>
    <div class="message">
      <strong>Time Conflict Detected</strong>
      <p>This activity overlaps with {{ conflicts.length }} other activity(ies)</p>
      <ul>
        <li v-for="conflict in conflicts" :key="conflict.id">
          {{ conflict.activity }} ({{ conflict.startTime }} - {{ conflict.endTime }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ItineraryActivity } from '~/types'

defineProps<{
  hasConflict: boolean
  conflicts: ItineraryActivity[]
}>()
</script>
