<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  ssr: true
})

navigateTo('/admin/projects')
</script>
