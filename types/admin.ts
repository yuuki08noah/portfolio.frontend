export type AdminStatus = 'pending' | 'active' | 'rejected' | 'disabled'

export interface AdminAccount {
  id: number
  email: string
  name: string
  role: 'admin' | 'super_admin'
  admin_status: AdminStatus
  admin_invited_by?: number
  admin_approved_by?: number[]
  admin_invite_token?: string
  admin_invite_expires_at?: string
  admin_status_reason?: string
  last_login_at?: string
}
