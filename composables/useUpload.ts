export const useUpload = () => {
    const config = useRuntimeConfig()
    const uploading = ref(false)
    const error = ref<string | null>(null)

    const uploadImage = async (file: File): Promise<string | null> => {
        uploading.value = true
        error.value = null

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await $fetch<{ url: string }>(`${config.public.backendApiBase}/api/v1/uploads`, {
                method: 'POST',
                body: formData
            })

            return response.url
        } catch (e: any) {
            console.error('Upload failed:', e)
            error.value = e.data?.error || 'Failed to upload image'
            return null
        } finally {
            uploading.value = false
        }
    }

    return {
        uploadImage,
        uploading,
        error
    }
}
