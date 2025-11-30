// Mock blog posts data
export default defineEventHandler(() => {
    const posts = [
        {
            id: '1',
            authorId: 'user-1',
            title: 'Getting Started with Nuxt 3',
            subtitle: 'A comprehensive guide to modern Vue development',
            slug: 'getting-started-with-nuxt-3',
            content: '# Getting Started\n\nNuxt 3 is an amazing framework...',
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
        },
        {
            id: '2',
            authorId: 'user-1',
            title: 'Modern CSS Techniques',
            subtitle: 'Flexbox, Grid, and Custom Properties',
            slug: 'modern-css-techniques',
            content: '# Modern CSS\n\nCSS has evolved significantly...',
            excerpt: 'Explore the latest CSS features and best practices',
            coverImage: '/images/blog/css-cover.jpg',
            tags: ['CSS', 'Web Design', 'Frontend'],
            category: 'Design',
            status: 'published',
            publishedAt: '2024-01-10T14:00:00Z',
            isPublic: true,
            views: 189,
            createdAt: '2024-01-10T13:00:00Z',
            updatedAt: '2024-01-10T14:00:00Z'
        },
        {
            id: '3',
            authorId: 'user-1',
            title: 'Building RESTful APIs',
            subtitle: 'Best practices and design patterns',
            slug: 'building-restful-apis',
            content: '# RESTful APIs\n\nAPI design is crucial...',
            excerpt: 'Learn how to design and build robust RESTful APIs',
            coverImage: '/images/blog/api-cover.jpg',
            tags: ['API', 'Backend', 'REST'],
            category: 'Development',
            status: 'published',
            publishedAt: '2024-01-05T11:00:00Z',
            isPublic: true,
            views: 312,
            createdAt: '2024-01-05T10:00:00Z',
            updatedAt: '2024-01-05T11:00:00Z'
        }
    ]

    return {
        data: posts,
        meta: {
            total: posts.length,
            page: 1,
            limit: 10,
            totalPages: 1
        }
    }
})
