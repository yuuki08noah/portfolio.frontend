<template>
  <div class="post-page" v-if="post">
    <PostDetail :post="post" />
    <RelatedPosts v-if="relatedPosts.length" :posts="relatedPosts" />
  </div>
  <div v-else class="empty-page">
    <p class="empty">Post not found.</p>
  </div>
</template>

<script setup lang="ts">
import PostDetail from '~/components/blog/PostDetail.vue'
import RelatedPosts from '~/components/blog/RelatedPosts.vue'

const route = useRoute()
const { fetchPost, incrementViews, fetchPosts } = useBlog()

const slug = route.params.slug as string
const { data: post } = await useAsyncData(`post-${slug}`, () =>
  fetchPost(slug).then((res) => res.data)
)
const { data: allPosts } = await useAsyncData('related-posts', () =>
  fetchPosts().then((res) => res.data)
)

onMounted(() => {
  if (post.value?.id) {
    incrementViews(post.value.id)
  }
})

const relatedPosts = computed(() =>
  (allPosts.value || [])
    .filter((item) => item.slug !== slug && item.category === post.value?.category)
    .slice(0, 2)
)
</script>

<style scoped>
.post-page {
  min-height: 100vh;
  background: #fff;
  padding: 80px 0 120px;
}

.empty-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty {
  font-family: 'Inter', sans-serif;
  color: #888;
  font-size: 1.1rem;
}
</style>
