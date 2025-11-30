<template>
  <div class="velog-stats-card" :class="{ compact }">
    <div v-if="stats" class="stats">
      <div class="stat">
        <span class="icon">❤️</span>
        <span class="value">{{ stats.likes }}</span>
      </div>
      <div class="stat">
        <span class="icon">💬</span>
        <span class="value">{{ stats.comments }}</span>
      </div>
      <div v-if="stats.views" class="stat">
        <span class="icon">👁️</span>
        <span class="value">{{ stats.views }}</span>
      </div>
    </div>
    <p v-if="stats && !compact" class="last-synced">
      Last synced: {{ formatDate(stats.lastFetchedAt) }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  docId: string
  compact?: boolean
}>()

const { getVelogStats } = useVelogIntegration()

const { data: stats } = await useAsyncData(`velog-stats-${props.docId}`, () =>
  getVelogStats(props.docId).then(res => res.data)
)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}
</script>
