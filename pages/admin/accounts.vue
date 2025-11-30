<template>
  <section class="admin-page container-narrow">
    <header class="page-header">
      <div>
        <p class="eyebrow">Admin Console</p>
        <h1>관리자 계정 생성 · 초대</h1>
        <p class="lede">
          초대 → 승인 → 초대 수락까지 한 화면에서 관리합니다. 토큰이 있다면 바로 테스트할 수 있어요.
        </p>
      </div>
      <div class="pill" :class="{ warn: !hasToken }">
        {{ hasToken ? '인증 토큰 감지' : '로그인 후 Authorization 헤더 필요' }}
      </div>
    </header>

    <div class="grid">
      <div class="card">
        <div class="card-header">
          <h2>새 관리자 초대</h2>
          <span class="hint">초대는 72시간 동안 유효</span>
        </div>
        <form class="form" @submit.prevent="handleInvite">
          <div class="field">
            <label for="admin-email">이메일</label>
            <input
              id="admin-email"
              v-model="inviteForm.email"
              type="email"
              required
              placeholder="admin@example.com"
            />
          </div>
          <div class="field">
            <label for="admin-name">이름</label>
            <input
              id="admin-name"
              v-model="inviteForm.name"
              type="text"
              placeholder="관리자 이름"
            />
          </div>
          <div class="field">
            <label for="admin-role">역할</label>
            <select id="admin-role" v-model="inviteForm.role">
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? '발송 중...' : '초대 발송' }}
          </button>
          <p v-if="inviteSuccess" class="success">{{ inviteSuccess }}</p>
          <p v-if="error" class="error">{{ error }}</p>
        </form>
      </div>

      <div class="card">
        <div class="card-header">
          <h2>초대 수락 (테스트용)</h2>
          <span class="hint">토큰 + 새 비밀번호</span>
        </div>
        <form class="form" @submit.prevent="handleAccept">
          <div class="field">
            <label for="token">초대 토큰</label>
            <input id="token" v-model="acceptForm.token" type="text" required />
          </div>
          <div class="field">
            <label for="accept-name">이름</label>
            <input id="accept-name" v-model="acceptForm.name" type="text" placeholder="표시할 이름" />
          </div>
          <div class="field">
            <label for="accept-password">비밀번호</label>
            <input id="accept-password" v-model="acceptForm.password" type="password" minlength="8" required />
          </div>
          <div class="field">
            <label for="accept-password-confirm">비밀번호 확인</label>
            <input
              id="accept-password-confirm"
              v-model="acceptForm.password_confirmation"
              type="password"
              minlength="8"
              required
            />
          </div>
          <button type="submit" class="btn btn-secondary">
            초대 수락
          </button>
          <p v-if="acceptSuccess" class="success">{{ acceptSuccess }}</p>
        </form>
      </div>
    </div>

    <div class="card table-card">
      <div class="card-header table-header">
        <div>
          <h2>관리자 목록</h2>
          <p class="hint">상태별 필터와 승인/비활성화 액션 지원</p>
        </div>
        <div class="controls">
          <select v-model="filterStatus" @change="loadAdmins">
            <option value="">전체</option>
            <option value="pending">대기</option>
            <option value="active">활성</option>
            <option value="rejected">거절</option>
            <option value="disabled">비활성</option>
          </select>
          <button class="btn ghost" @click="loadAdmins" :disabled="loading">새로고침</button>
        </div>
      </div>

      <div v-if="loading" class="placeholder">불러오는 중...</div>
      <div v-else-if="!admins.length" class="placeholder muted">관리자 계정이 없습니다. 초대를 생성하세요.</div>
      <table v-else class="admin-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>이메일</th>
            <th>역할</th>
            <th>상태</th>
            <th>토큰</th>
            <th>초대 만료</th>
            <th>승인자 수</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="admin in admins" :key="admin.id">
            <td>{{ admin.name }}</td>
            <td>{{ admin.email }}</td>
            <td class="mono">{{ admin.role }}</td>
            <td>
              <span class="badge" :class="admin.admin_status">{{ renderStatus(admin.admin_status) }}</span>
            </td>
            <td class="mono">
              <span v-if="admin.admin_invite_token">{{ admin.admin_invite_token }}</span>
              <span v-else class="muted">-</span>
            </td>
            <td>
              <span v-if="admin.admin_invite_expires_at">
                {{ formatDate(admin.admin_invite_expires_at) }}
              </span>
              <span v-else class="muted">-</span>
            </td>
            <td>{{ admin.admin_approved_by?.length || 0 }}</td>
            <td class="actions">
              <button
                class="btn ghost small"
                :disabled="admin.admin_status === 'active'"
                @click="handleApprove(admin.id)"
              >
                승인
              </button>
              <button
                class="btn ghost small warn"
                @click="toggleStatus(admin)"
              >
                {{ admin.admin_status === 'disabled' ? '재활성화' : '비활성화' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useAdminAccounts } from '~/composables/useAdminAccounts'
import type { AdminStatus } from '~/types/admin'
import { AUTH_TOKEN_KEY } from '~/composables/useAuth'

definePageMeta({
  middleware: ['admin']
})

const { admins, loading, error, fetchAdmins, inviteAdmin, approveAdmin, updateStatus, acceptInvite } = useAdminAccounts()

const inviteForm = reactive({
  email: '',
  name: '',
  role: 'admin' as 'admin' | 'super_admin'
})
const acceptForm = reactive({
  token: '',
  name: '',
  password: '',
  password_confirmation: ''
})
const inviteSuccess = ref('')
const acceptSuccess = ref('')
const filterStatus = ref<AdminStatus | ''>('')

const hasToken = computed(() => {
  if (process.client) {
    return Boolean(localStorage.getItem(AUTH_TOKEN_KEY))
  }
  return false
})

const loadAdmins = async () => {
  inviteSuccess.value = ''
  await fetchAdmins(filterStatus.value || undefined)
}

onMounted(loadAdmins)

const handleInvite = async () => {
  inviteSuccess.value = ''
  const created = await inviteAdmin({
    email: inviteForm.email,
    name: inviteForm.name,
    role: inviteForm.role
  })

  if (created) {
    inviteSuccess.value = created.admin_invite_token
      ? `초대 생성 완료 (id: ${created.id}). 토큰: ${created.admin_invite_token}`
      : `초대 생성 완료 (id: ${created.id}).`
    inviteForm.email = ''
    inviteForm.name = ''
    inviteForm.role = 'admin'
  }
}

const handleAccept = async () => {
  acceptSuccess.value = ''
  const result = await acceptInvite(acceptForm)
  if (result?.message) {
    acceptSuccess.value = result.message
    acceptForm.token = ''
    acceptForm.name = ''
    acceptForm.password = ''
    acceptForm.password_confirmation = ''
  }
}

const handleApprove = async (id: number) => {
  await approveAdmin(id)
}

const toggleStatus = async (admin: { id: number; admin_status: AdminStatus }) => {
  const next = admin.admin_status === 'disabled' ? 'active' : 'disabled'
  await updateStatus(admin.id, next)
}

const formatDate = (value?: string) => {
  if (!value) return ''
  return new Date(value).toLocaleString()
}

const renderStatus = (status: AdminStatus) => {
  switch (status) {
    case 'pending':
      return '대기'
    case 'active':
      return '활성'
    case 'rejected':
      return '거절'
    case 'disabled':
      return '비활성'
    default:
      return status
  }
}
</script>

<style scoped>
.admin-page {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  padding: var(--spacing-2xl) var(--spacing-md);
}

.page-header {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-lg);
  align-items: flex-start;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: 700;
  color: var(--color-muted);
  margin: 0 0 var(--spacing-xs);
}

.page-header h1 {
  margin: 0 0 var(--spacing-sm);
  font-size: 2rem;
}

.lede {
  margin: 0;
  color: var(--color-gray-700);
}

.pill {
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: 999px;
  background: #e6f6ed;
  color: #1c7c44;
  font-weight: 700;
  border: 1px solid #a0e3bf;
}

.pill.warn {
  background: #fff4ec;
  color: #c05621;
  border-color: #f7c3a0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-lg);
}

.card {
  padding: var(--spacing-xl);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: var(--radius-md);
  background: var(--color-white);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.03);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.hint {
  color: var(--color-muted);
  font-size: var(--text-sm);
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.field label {
  font-weight: 700;
  color: var(--color-text);
}

.field input,
.field select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--color-border, #e5e7eb);
  border-radius: var(--radius-sm);
  font-size: 1rem;
}

.btn {
  border: 1px solid #111;
  background: #111;
  color: #fff;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  color: #111;
}

.btn-primary {
  background: #111;
  color: #fff;
}

.btn.ghost {
  background: transparent;
  color: #111;
  border-color: var(--color-border, #e5e7eb);
}

.btn.small {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: 0.9rem;
}

.btn.warn {
  border-color: #f97316;
  color: #c05621;
}

.success {
  color: #1c7c44;
  margin: 0;
}

.error {
  color: #c00;
  margin: 0;
}

.table-card {
  overflow-x: auto;
}

.table-header {
  align-items: flex-start;
}

.controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: var(--spacing-md);
}

.admin-table th,
.admin-table td {
  padding: var(--spacing-sm) var(--spacing-xs);
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  text-align: left;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.badge.pending {
  background: #fff7ed;
  color: #c05621;
}

.badge.active {
  background: #ecfdf3;
  color: #15803d;
}

.badge.rejected {
  background: #fef2f2;
  color: #b91c1c;
}

.badge.disabled {
  background: #f3f4f6;
  color: #4b5563;
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.actions {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.placeholder {
  padding: var(--spacing-lg);
}

.placeholder.muted {
  color: var(--color-muted);
}

.muted {
  color: var(--color-muted);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
  }

  .controls {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
