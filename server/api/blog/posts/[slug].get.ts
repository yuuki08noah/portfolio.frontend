// Mock blog post detail by slug
export default defineEventHandler((event) => {
    const slug = event.context.params?.slug

    // Mock post data
    const posts = {
        'getting-started-with-nuxt-3': {
            id: '1',
            authorId: 'user-1',
            title: 'Getting Started with Nuxt 3',
            subtitle: 'A comprehensive guide to modern Vue development',
            slug: 'getting-started-with-nuxt-3',
            content: `# Getting Started with Nuxt 3

Nuxt 3 is an amazing framework for building modern web applications with Vue.js. In this guide, we'll explore the key features and best practices.

## Installation

\`\`\`bash
npx nuxi init my-app
cd my-app
npm install
npm run dev
\`\`\`

## Features

- **Auto Imports**: Components, composables, and utilities
- **File-based Routing**: Pages directory structure
- **Server-Side Rendering**: Automatic SSR support
- **TypeScript**: Built-in TypeScript support

## Conclusion

Nuxt 3 makes Vue development a breeze!`,
            excerpt: 'Learn how to build modern web applications with Nuxt 3',
            coverImage: '/images/blog/nuxt3-cover.jpg',
            tags: ['Vue', 'Nuxt', 'JavaScript'],
            category: 'Development',
            status: 'published',
            publishedAt: '2024-01-15T10:00:00Z',
            isPublic: true,
            views: 245,
            createdAt: '2024-01-15T09:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z'
        }
    }

    const post = posts[slug as keyof typeof posts]

    if (!post) {
        throw createError({
            statusCode: 404,
            message: 'Post not found'
        })
    }

    return { data: post }
})
