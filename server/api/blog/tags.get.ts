// Mock blog tags
export default defineEventHandler(() => {
    const tags = [
        { id: '1', name: 'Vue', slug: 'vue', postCount: 12, usageCount: 45 },
        { id: '2', name: 'Nuxt', slug: 'nuxt', postCount: 10, usageCount: 38 },
        { id: '3', name: 'JavaScript', slug: 'javascript', postCount: 18, usageCount: 67 },
        { id: '4', name: 'TypeScript', slug: 'typescript', postCount: 15, usageCount: 52 },
        { id: '5', name: 'CSS', slug: 'css', postCount: 9, usageCount: 31 },
        { id: '6', name: 'Web Design', slug: 'web-design', postCount: 7, usageCount: 22 },
        { id: '7', name: 'API', slug: 'api', postCount: 6, usageCount: 19 },
        { id: '8', name: 'Backend', slug: 'backend', postCount: 8, usageCount: 27 }
    ]

    return { data: tags }
})
