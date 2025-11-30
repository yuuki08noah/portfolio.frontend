export default defineEventHandler((event) => {
    const id = getRouterParam(event, 'id')

    // Mock delete logic
    return {
        success: true,
        message: `User ${id} deleted successfully`
    }
})
