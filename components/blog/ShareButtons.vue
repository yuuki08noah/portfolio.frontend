<template>
  <div class="share-buttons">
    <button @click="shareOnTwitter" class="share-btn twitter">
      Twitter
    </button>
    <button @click="shareOnFacebook" class="share-btn facebook">
      Facebook
    </button>
    <button @click="shareOnLinkedIn" class="share-btn linkedin">
      LinkedIn
    </button>
    <button @click="copyLink" class="share-btn copy">
      Copy Link
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  url: string
}>()

const shareOnTwitter = () => {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(props.title)}&url=${encodeURIComponent(props.url)}`
  window.open(twitterUrl, '_blank')
}

const shareOnFacebook = () => {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(props.url)}`
  window.open(facebookUrl, '_blank')
}

const shareOnLinkedIn = () => {
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(props.url)}`
  window.open(linkedInUrl, '_blank')
}

const copyLink = () => {
  navigator.clipboard.writeText(props.url)
  alert('Link copied to clipboard!')
}
</script>
