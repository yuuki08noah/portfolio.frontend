<template>
  <nav class="table-of-contents">
    <h3>Table of Contents</h3>
    <ul>
      <li v-for="item in toc" :key="item.id" :style="{ paddingLeft: `${item.level * 0.5}rem` }">
        <a :href="`#${item.id}`">{{ item.text }}</a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  markdown: string
}>()

const { extractToc } = useMarkdown()

const toc = computed(() => extractToc(props.markdown))
</script>
