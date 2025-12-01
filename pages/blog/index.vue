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
          <ClientOnly>
          </ClientOnly>
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

        <!-- Project Docs Section -->
        <section v-if="projects && projects.length > 0" class="project-docs-section">
          <h2 class="section-title">Project Documents</h2>
          <div class="projects-grid">
            <NuxtLink
              v-for="project in projects"
              :key="project.id"
              :to="`/blog/projects/${project.slug}`"
              class="project-card"
            >
              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-description">{{ project.description }}</p>
              <div class="project-stack">
                <span v-for="tech in project.stack?.slice(0, 3)" :key="tech" class="tech-tag">
                  {{ tech }}
                </span>
              </div>
            </NuxtLink>
          </div>
        </section>
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
const { fetchProjects, fetchProjectDocs } = useProjects()
const { isAdmin } = useAuth()

const { data: posts, error: postsError } = await useAsyncData('blog-posts', async () => {
  try {
    const res = await fetchPosts()
    return res.data || []
  } catch (e) {
    console.error('Failed to fetch posts:', e)
    return []
  }
})

const { data: categories } = await useAsyncData('blog-categories', async () => {
  try {
    const res = await fetchCategories()
    return res.data || []
  } catch (e) {
    console.error('Failed to fetch categories:', e)
    return []
  }
})

const { data: tags } = await useAsyncData('blog-tags', async () => {
  try {
    const res = await fetchTags()
    return res.data || []
  } catch (e) {
    console.error('Failed to fetch tags:', e)
    return []
  }
})

const { data: projects } = await useAsyncData('projects', async () => {
  try {
    const res = await fetchProjects()
    return res.projects || []
  } catch (e) {
    console.error('Failed to fetch projects:', e)
    return []
  }
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
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
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

.project-docs-section {
  margin-top: 80px;
  padding-top: 80px;
  border-top: 1px solid #f0f0f0;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 40px;
  letter-spacing: -1px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 32px;
}

.project-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  padding: 32px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.project-card:hover {
  border-color: #111;
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.project-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111;
  margin: 0;
}

.project-description {
  font-family: 'Merriweather', serif;
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

.project-stack {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tech-tag {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  padding: 4px 12px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
