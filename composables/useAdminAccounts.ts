import { ref } from 'vue'
import type { AdminAccount, AdminStatus } from '~/types/admin'

export function useAdminAccounts() {
  const { get, post, put } = useApi()
  
  const admins = ref<AdminAccount[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchAdmins = async (status?: AdminStatus) => {
    loading.value = true
    error.value = null
    try {
      const endpoint = status ? `/api/v1/admin/accounts?status=${status}` : '/api/v1/admin/accounts'
      const response = await get<{ admins: AdminAccount[] }>(endpoint)
      admins.value = response.admins || []
      return admins.value
    } catch (e: any) {
      error.value = e?.data?.error || 'Failed to load admin accounts'
      return []
    } finally {
      loading.value = false
    }
  }

  const inviteAdmin = async (payload: { email: string; name?: string; role?: 'admin' | 'super_admin' }) => {
    loading.value = true
    error.value = null
    try {
      const response = await post<{ admin: AdminAccount }>('/api/v1/admin/accounts/invite', payload)
      if (response.admin) {
        admins.value = [response.admin, ...admins.value]
      }
      return response.admin
    } catch (e: any) {
      error.value = e?.data?.error || e?.data?.errors?.join(', ') || 'Failed to invite admin'
      return null
    } finally {
      loading.value = false
    }
  }

  const approveAdmin = async (id: number, reason?: string) => {
    error.value = null
    try {
      const response = await post<{ admin: AdminAccount }>(`/api/v1/admin/accounts/${id}/approve`, { reason })
      admins.value = admins.value.map((admin) => (admin.id === id ? response.admin : admin))
      return response.admin
    } catch (e: any) {
      error.value = e?.data?.error || 'Failed to approve admin'
      return null
    }
  }

  const rejectAdmin = async (id: number, reason?: string) => {
    error.value = null
    try {
      const response = await post<{ admin: AdminAccount }>(`/api/v1/admin/accounts/${id}/reject`, { reason })
      admins.value = admins.value.map((admin) => (admin.id === id ? response.admin : admin))
      return response.admin
    } catch (e: any) {
      error.value = e?.data?.error || 'Failed to reject admin'
      return null
    }
  }

  const updateStatus = async (id: number, status: AdminStatus, reason?: string) => {
    error.value = null
    try {
      const response = await put<{ admin: AdminAccount }>(`/api/v1/admin/accounts/${id}/status`, { status, reason })
      admins.value = admins.value.map((admin) => (admin.id === id ? response.admin : admin))
      return response.admin
    } catch (e: any) {
      error.value = e?.data?.error || 'Failed to update status'
      return null
    }
  }

  const acceptInvite = async (payload: { token: string; name?: string; password: string; password_confirmation: string }) => {
    error.value = null
    try {
      const response = await post<{ admin: AdminAccount; message: string }>('/api/v1/admin/accounts/accept', payload, false)
      return response
    } catch (e: any) {
      error.value = e?.data?.error || e?.data?.errors?.join(', ') || 'Failed to accept invite'
      return null
    }
  }

  return {
    admins,
    loading,
    error,
    fetchAdmins,
    inviteAdmin,
    approveAdmin,
    rejectAdmin,
    updateStatus,
    acceptInvite
  }
}
