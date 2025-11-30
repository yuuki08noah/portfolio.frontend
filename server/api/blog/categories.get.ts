// Mock blog categories
export default defineEventHandler(() => {
    const categories = [
        {
            id: '1',
            name: 'Development',
            slug: 'development',
            description: 'Web development tutorials and tips',
            color: '#3b82f6',
            icon: '💻',
            postCount: 15
        },
        {
            id: '2',
            name: 'Design',
            slug: 'design',
            description: 'UI/UX design and visual creativity',
            color: '#8b5cf6',
            icon: '🎨',
            postCount: 8
        },
        {
            id: '3',
            name: 'Productivity',
            slug: 'productivity',
            description: 'Tools and techniques for better productivity',
            color: '#10b981',
            icon: '⚡',
            postCount: 5
        }
    ]

    return { data: categories }
})
