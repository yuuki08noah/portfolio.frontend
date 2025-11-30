<template>
  <div class="blog-page">
    <section class="blog-hero">
      <div class="container">
        <div class="hero-header">
          <div>
            <h1 class="page-title">Blog</h1>
            <div class="hero-divider"></div>
            <p class="page-subtitle">Thoughts, insights, and stories from my journey.</p>
          </div>
          <NuxtLink v-if="isAdmin()" to="/blog/write" class="btn-write-post">
            + Write Post
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="blog-content">
      <div class="container">
        <!-- Filters -->
        <div class="blog-filters">
          <div class="search-wrapper">
            <BlogSearch />
          </div>
          <div class="filter-options">
            <CategoryList :categories="categories || []" />
            <TagCloud :tags="tags || []" />
          </div>
        </div>

        <!-- Post List -->
        <PostList :posts="posts || []" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import BlogSearch from '~/components/blog/BlogSearch.vue'
import CategoryList from '~/components/blog/CategoryList.vue'
import TagCloud from '~/components/blog/TagCloud.vue'
import PostList from '~/components/blog/PostList.vue'

const { fetchPosts, fetchCategories, fetchTags } = useBlog()
const { isAdmin } = useAuth()

const { data: posts } = await useAsyncData('blog-posts', async () => {
  const res = await fetchPosts()
  return res.data
})
const { data: categories } = await useAsyncData('blog-categories', async () => {
  const res = await fetchCategories()
  return res.data
})
const { data: tags } = await useAsyncData('blog-tags', async () => {
  const res = await fetchTags()
  return res.data
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Merriweather:wght@300;400;700&family=Inter:wght@400;500;600&display=swap');

.blog-page {
  min-height: 100vh;
  background-color: #fff;
  font-family: 'Merriweather', serif;
}

.blog-hero {
  padding: 100px 0 60px;
  border-bottom: 1px solid #f0f0f0;
}

.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 60px;
}

.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 4rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 30px;
  letter-spacing: -1px;
}

.hero-divider {
  width: 60px;
  height: 2px;
  background-color: #111;
  margin-bottom: 20px;
}

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.page-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
}

.btn-write-post {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #111;
  color: #fff;
  padding: 12px 24px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 1px solid #111;
  border-radius: 4px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.btn-write-post:hover {
  background: #fff;
  color: #111;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.blog-content {
  padding: 80px 0 120px;
}

.blog-filters {
  margin-bottom: 60px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.search-wrapper {
  width: 100%;
}

.filter-options {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }

  .filter-options {
    flex-direction: column;
    gap: 20px;
  }
}
</style>
