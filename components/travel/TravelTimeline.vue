<template>
  <div class="travel-timeline">
    <div v-for="(item, index) in items" :key="index" class="timeline-item">
      <div class="timeline-marker" />
      <div class="timeline-content">
        <slot name="item" :item="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: any[]
}>()
</script>
