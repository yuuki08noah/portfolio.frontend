export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // Mock creation logic
    const newUser = {
        id: Math.floor(Math.random() * 1000),
        ...body,
        status: 'Pending',
        createdAt: new Date().toISOString()
    }

    return {
        data: newUser
    }
})
