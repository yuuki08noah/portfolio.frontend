<template>
  <div class="markdown-content" v-html="rendered" />
</template>

<script setup lang="ts">
const props = defineProps<{
  content: string
}>()

const { renderMarkdown } = useMarkdown()

const rendered = computed(() => renderMarkdown(props.content))
</script>
