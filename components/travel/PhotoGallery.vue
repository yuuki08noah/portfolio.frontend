<template>
  <div class="photo-gallery">
    <div
      v-for="(photo, index) in photos"
      :key="index"
      class="photo-item"
      @click="openLightbox(index)"
    >
      <img :src="photo" :alt="`Photo ${index + 1}`" />
    </div>
    
    <div v-if="showLightbox" class="lightbox" @click="closeLightbox">
      <img :src="photos[currentIndex]" :alt="`Photo ${currentIndex + 1}`" />
      <button @click.stop="prevPhoto" class="nav-btn prev">&lt;</button>
      <button @click.stop="nextPhoto" class="nav-btn next">&gt;</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  photos: string[]
}>()

const showLightbox = ref(false)
const currentIndex = ref(0)

const openLightbox = (index: number) => {
  currentIndex.value = index
  showLightbox.value = true
}

const closeLightbox = () => {
  showLightbox.value = false
}

const prevPhoto = () => {
  currentIndex.value = (currentIndex.value - 1 + photos.length) % photos.length
}

const nextPhoto = () => {
  currentIndex.value = (currentIndex.value + 1) % photos.length
}
</script>
