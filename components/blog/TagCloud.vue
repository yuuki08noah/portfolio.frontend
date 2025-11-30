<template>
  <div class="tag-cloud">
    <NuxtLink
      v-for="tag in tags"
      :key="tag.id"
      :to="`/blog/tag/${tag.slug}`"
      class="tag"
      :style="{ fontSize: getTagSize(tag.usageCount) }"
    >
      {{ tag.name }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { Tag } from '~/types'

const props = defineProps<{
  tags: Tag[]
}>()

const getTagSize = (count: number) => {
  const minSize = 0.8
  const maxSize = 2
  const maxCount = Math.max(...props.tags.map(t => t.usageCount))
  const size = minSize + (count / maxCount) * (maxSize - minSize)
  return `${size}rem`
}
</script>
