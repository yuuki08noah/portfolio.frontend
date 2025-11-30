export default defineEventHandler((event) => {
    // Mock data
    const users = [
        {
            id: 1,
            name: "Yuuki Noah",
            email: "yuuki@example.com",
            role: "Admin",
            status: "Active",
            avatar: "/images/profile-visual.png"
        },
        {
            id: 2,
            name: "Sarah Kim",
            email: "sarah@example.com",
            role: "Editor",
            status: "Active",
            avatar: null
        },
        {
            id: 3,
            name: "John Doe",
            email: "john@example.com",
            role: "Viewer",
            status: "Inactive",
            avatar: null
        }
    ]

    return {
        data: users
    }
})
