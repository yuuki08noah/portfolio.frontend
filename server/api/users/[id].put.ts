export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    // Mock update logic
    return {
        data: {
            id,
            ...body,
            updatedAt: new Date().toISOString()
        }
    }
})
