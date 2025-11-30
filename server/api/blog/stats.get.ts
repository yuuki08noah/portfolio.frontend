// Mock blog statistics
export default defineEventHandler(() => {
    const stats = {
        totalPosts: 24,
        totalViews: 3456,
        totalDrafts: 3,
        popularPosts: [
            {
                id: '3',
                title: 'Building RESTful APIs',
                slug: 'building-restful-apis',
                views: 312
            },
            {
                id: '1',
                title: 'Getting Started with Nuxt 3',
                slug: 'getting-started-with-nuxt-3',
                views: 245
            },
            {
                id: '2',
                title: 'Modern CSS Techniques',
                slug: 'modern-css-techniques',
                views: 189
            }
        ],
        monthlyPosts: [
            { month: '2024-01', count: 8 },
            { month: '2023-12', count: 12 },
            { month: '2023-11', count: 4 }
        ],
        categoryDistribution: [
            { category: 'Development', count: 15 },
            { category: 'Design', count: 8 },
            { category: 'Productivity', count: 1 }
        ]
    }

    return { data: stats }
})
