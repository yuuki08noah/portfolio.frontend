<template>
  <a :href="url" target="_blank" rel="noopener noreferrer" class="velog-link-button">
    <span class="icon">🔗</span>
    <span>View on Velog</span>
  </a>
</template>

<script setup lang="ts">
defineProps<{
  url: string
}>()
</script>
