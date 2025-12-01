<template>
  <AdminLayout title="Travel" subtitle="Manage your travel diaries and plans with multi-language support">
    <div class="travel-tabs">
      <button :class="['travel-tab', { active: activeTab === 'diaries' }]" @click="activeTab = 'diaries'">
        Diaries
      </button>
      <button :class="['travel-tab', { active: activeTab === 'plans' }]" @click="activeTab = 'plans'">
        Plans
      </button>
    </div>

    <!-- Diaries Tab -->
    <div v-if="activeTab === 'diaries'">
      <div class="tab-actions">
        <button class="btn btn-primary" @click="openDiaryModal()">+ Add Diary</button>
      </div>

      <div v-if="loadingDiaries" class="admin-loading">Loading...</div>
      <div v-else class="admin-list">
        <div v-for="diary in diaries" :key="diary.id" class="admin-list-item">
          <div class="admin-list-item-info">
            <h3 class="admin-list-item-title">{{ diary.title || `${diary.destination.city}, ${diary.destination.country}` }}</h3>
            <p v-if="diary.translations?.ko?.title" class="admin-list-item-trans">KO: {{ diary.translations.ko.title }}</p>
            <p v-if="diary.translations?.ja?.title" class="admin-list-item-trans">JA: {{ diary.translations.ja.title }}</p>
            <p class="admin-list-item-meta">
              {{ diary.destination.city }}, {{ diary.destination.country }} •
              {{ formatDate(diary.startDate) }} - {{ formatDate(diary.endDate) }}
            </p>
          </div>
          <div class="admin-list-item-actions">
            <button class="btn btn-secondary btn-sm" @click="openDiaryModal(diary)">Edit</button>
            <button class="btn btn-danger btn-sm" @click="deleteDiary(diary.id)">Delete</button>
          </div>
        </div>
        <div v-if="diaries.length === 0" class="admin-empty">No diaries yet.</div>
      </div>
    </div>

    <!-- Plans Tab -->
    <div v-if="activeTab === 'plans'">
      <div class="tab-actions">
        <button class="btn btn-primary" @click="openPlanModal()">+ Add Plan</button>
      </div>

      <div v-if="loadingPlans" class="admin-loading">Loading...</div>
      <div v-else class="admin-list">
        <div v-for="plan in plans" :key="plan.id" class="admin-list-item">
          <div class="admin-list-item-info">
            <h3 class="admin-list-item-title">{{ plan.destination.city }}, {{ plan.destination.country }}</h3>
            <p v-if="plan.translations?.ko?.destination_city" class="admin-list-item-trans">
              KO: {{ plan.translations.ko.destination_city }}, {{ plan.translations.ko.destination_country }}
            </p>
            <p v-if="plan.translations?.ja?.destination_city" class="admin-list-item-trans">
              JA: {{ plan.translations.ja.destination_city }}, {{ plan.translations.ja.destination_country }}
            </p>
            <p class="admin-list-item-meta">
              Status: <span :class="['badge', statusClass(plan.status)]">{{ plan.status }}</span> ·
              {{ plan.targetDate ? formatDate(plan.targetDate) : 'TBD' }}
            </p>
          </div>
          <div class="admin-list-item-actions">
            <button class="btn btn-secondary btn-sm" @click="openPlanModal(plan)">Edit</button>
            <button class="btn btn-danger btn-sm" @click="deletePlan(plan.id)">Delete</button>
          </div>
        </div>
        <div v-if="plans.length === 0" class="admin-empty">No plans yet.</div>
      </div>
    </div>

    <!-- Diary Modal -->
    <div v-if="showDiaryModal" class="modal-overlay" @click.self="closeDiaryModal">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">{{ editingDiary ? 'Edit Diary' : 'Add Diary' }}</h2>
        </div>
        
        <LangTabs v-model="diaryLang" />

        <form @submit.prevent="saveDiary">
          <!-- English -->
          <div v-show="diaryLang === 'en'">
            <div class="form-group">
              <label>Title (EN)</label>
              <input v-model="diaryForm.title" type="text" />
            </div>
            <div class="form-group">
              <label>Description (EN)</label>
              <textarea v-model="diaryForm.description" rows="3"></textarea>
            </div>
          </div>

          <!-- Korean -->
          <div v-show="diaryLang === 'ko'">
            <div class="form-group">
              <label>제목 (KO)</label>
              <input v-model="diaryForm.translations.ko.title" type="text" placeholder="한국어 제목" />
            </div>
            <div class="form-group">
              <label>설명 (KO)</label>
              <textarea v-model="diaryForm.translations.ko.description" rows="3" placeholder="한국어 설명"></textarea>
            </div>
          </div>

          <!-- Japanese -->
          <div v-show="diaryLang === 'ja'">
            <div class="form-group">
              <label>タイトル (JA)</label>
              <input v-model="diaryForm.translations.ja.title" type="text" placeholder="日本語タイトル" />
            </div>
            <div class="form-group">
              <label>説明 (JA)</label>
              <textarea v-model="diaryForm.translations.ja.description" rows="3" placeholder="日本語説明"></textarea>
            </div>
          </div>

          <!-- Common fields -->
          <div class="form-divider">Common Settings</div>
          <div class="form-row">
            <div class="form-group">
              <label>Country</label>
              <input v-model="diaryForm.destinationCountry" type="text" required />
            </div>
            <div class="form-group">
              <label>City</label>
              <input v-model="diaryForm.destinationCity" type="text" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Start Date</label>
              <input v-model="diaryForm.startDate" type="date" required />
            </div>
            <div class="form-group">
              <label>End Date</label>
              <input v-model="diaryForm.endDate" type="date" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Rating</label>
              <select v-model="diaryForm.rating">
                <option :value="null">-</option>
                <option v-for="i in 5" :key="i" :value="i">{{ i }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Public</label>
              <select v-model="diaryForm.isPublic">
                <option :value="true">Yes</option>
                <option :value="false">No</option>
              </select>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeDiaryModal">Cancel</button>
            <button type="submit" class="btn btn-primary">{{ editingDiary ? 'Update' : 'Add' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Plan Modal -->
    <div v-if="showPlanModal" class="modal-overlay" @click.self="closePlanModal">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">{{ editingPlan ? 'Edit Plan' : 'Add Plan' }}</h2>
        </div>
        
        <LangTabs v-model="planLang" />

        <form @submit.prevent="savePlan">
          <!-- English -->
          <div v-show="planLang === 'en'">
            <div class="form-row">
              <div class="form-group">
                <label>Country (EN)</label>
                <input v-model="planForm.destinationCountry" type="text" required />
              </div>
              <div class="form-group">
                <label>City (EN)</label>
                <input v-model="planForm.destinationCity" type="text" required />
              </div>
            </div>
            <div class="form-group">
              <label>Notes (EN)</label>
              <textarea v-model="planForm.notes" rows="3"></textarea>
            </div>
          </div>

          <!-- Korean -->
          <div v-show="planLang === 'ko'">
            <div class="form-row">
              <div class="form-group">
                <label>국가 (KO)</label>
                <input v-model="planForm.translations.ko.destination_country" type="text" placeholder="대한민국" />
              </div>
              <div class="form-group">
                <label>도시 (KO)</label>
                <input v-model="planForm.translations.ko.destination_city" type="text" placeholder="서울" />
              </div>
            </div>
            <div class="form-group">
              <label>메모 (KO)</label>
              <textarea v-model="planForm.translations.ko.notes" rows="3" placeholder="한국어 메모"></textarea>
            </div>
          </div>

          <!-- Japanese -->
          <div v-show="planLang === 'ja'">
            <div class="form-row">
              <div class="form-group">
                <label>国 (JA)</label>
                <input v-model="planForm.translations.ja.destination_country" type="text" placeholder="韓国" />
              </div>
              <div class="form-group">
                <label>都市 (JA)</label>
                <input v-model="planForm.translations.ja.destination_city" type="text" placeholder="ソウル" />
              </div>
            </div>
            <div class="form-group">
              <label>メモ (JA)</label>
              <textarea v-model="planForm.translations.ja.notes" rows="3" placeholder="日本語メモ"></textarea>
            </div>
          </div>

          <!-- Common fields -->
          <div class="form-divider">Common Settings</div>
          <div class="form-row">
            <div class="form-group">
              <label>Target Date</label>
              <input v-model="planForm.targetDate" type="date" />
            </div>
            <div class="form-group">
              <label>Duration (days)</label>
              <input v-model="planForm.duration" type="number" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Status</label>
              <select v-model="planForm.status" class="form-input">
                <option value="planning">Planning</option>
                <option value="booked">Booked</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div class="form-field">
              <label class="form-label">Budget</label>
              <input v-model="planForm.budgetAmount" type="number" class="form-input" placeholder="Amount" />
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closePlanModal">Cancel</button>
            <button type="submit" class="btn btn-primary">{{ editingPlan ? 'Update' : 'Add' }}</button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import type { TravelDiary, TravelPlan } from '~/types'
import AdminLayout from '~/components/admin/AdminLayout.vue'
import LangTabs from '~/components/admin/LangTabs.vue'
import '~/assets/css/admin.css'

definePageMeta({
  middleware: ['auth'],
  ssr: true
})

const { fetchDiaries, createDiary, updateDiary, deleteDiary: removeDiary } = useTravelDiary()
const { fetchPlans, createPlan, updatePlan, deletePlan: removePlan } = useTravelPlan()

const activeTab = ref<'diaries' | 'plans'>('diaries')

// Language tabs for modals
const diaryLang = ref<'en' | 'ko' | 'ja'>('en')
const planLang = ref<'en' | 'ko' | 'ja'>('en')

const statusClass = (status: string) => {
  switch (status) {
    case 'completed': return 'badge-success'
    case 'booked': return 'badge-info'
    case 'cancelled': return 'badge-default'
    default: return 'badge-warning'
  }
}

// Diaries
const loadingDiaries = ref(true)
const diaries = ref<TravelDiary[]>([])
const showDiaryModal = ref(false)
const editingDiary = ref<TravelDiary | null>(null)

interface DiaryTranslation {
  title: string
  description: string
}

interface DiaryForm {
  title: string
  destinationCountry: string
  destinationCity: string
  startDate: string
  endDate: string
  description: string
  rating: number | null
  isPublic: boolean
  translations: {
    ko: DiaryTranslation
    ja: DiaryTranslation
  }
}

const defaultDiaryForm: DiaryForm = {
  title: '',
  destinationCountry: '',
  destinationCity: '',
  startDate: '',
  endDate: '',
  description: '',
  rating: null,
  isPublic: false,
  translations: {
    ko: { title: '', description: '' },
    ja: { title: '', description: '' }
  }
}
const diaryForm = ref<DiaryForm>({ ...defaultDiaryForm, translations: { ko: { ...defaultDiaryForm.translations.ko }, ja: { ...defaultDiaryForm.translations.ja } } })

// Plans
const loadingPlans = ref(true)
const plans = ref<TravelPlan[]>([])
const showPlanModal = ref(false)
const editingPlan = ref<TravelPlan | null>(null)

interface PlanTranslation {
  destination_country: string
  destination_city: string
  notes: string
}

interface PlanForm {
  destinationCountry: string
  destinationCity: string
  targetDate: string
  duration: number | null
  status: 'planning' | 'booked' | 'completed' | 'cancelled'
  budgetAmount: number | null
  notes: string
  translations: {
    ko: PlanTranslation
    ja: PlanTranslation
  }
}

const defaultPlanForm: PlanForm = {
  destinationCountry: '',
  destinationCity: '',
  targetDate: '',
  duration: null,
  status: 'planning',
  budgetAmount: null,
  notes: '',
  translations: {
    ko: { destination_country: '', destination_city: '', notes: '' },
    ja: { destination_country: '', destination_city: '', notes: '' }
  }
}
const planForm = ref<PlanForm>({ ...defaultPlanForm, translations: { ko: { ...defaultPlanForm.translations.ko }, ja: { ...defaultPlanForm.translations.ja } } })

onMounted(async () => {
  await Promise.all([loadDiaries(), loadPlans()])
})

const loadDiaries = async () => {
  loadingDiaries.value = true
  try {
    const res = await fetchDiaries()
    diaries.value = res.data || []
  } catch (e) {
    console.error('Failed to load diaries', e)
  } finally {
    loadingDiaries.value = false
  }
}

const loadPlans = async () => {
  loadingPlans.value = true
  try {
    const res = await fetchPlans()
    plans.value = res.data || []
  } catch (e) {
    console.error('Failed to load plans', e)
  } finally {
    loadingPlans.value = false
  }
}

// Diary functions
const openDiaryModal = (diary?: TravelDiary) => {
  if (diary) {
    editingDiary.value = diary
    diaryForm.value = {
      title: diary.title || '',
      destinationCountry: diary.destination.country,
      destinationCity: diary.destination.city,
      startDate: diary.startDate,
      endDate: diary.endDate,
      description: diary.description || '',
      rating: diary.rating || null,
      isPublic: diary.isPublic,
      translations: {
        ko: {
          title: diary.translations?.ko?.title || '',
          description: diary.translations?.ko?.description || ''
        },
        ja: {
          title: diary.translations?.ja?.title || '',
          description: diary.translations?.ja?.description || ''
        }
      }
    }
  }
  diaryLang.value = 'en'
  showDiaryModal.value = true
}

const closeDiaryModal = () => {
  showDiaryModal.value = false
  editingDiary.value = null
  diaryLang.value = 'en'
  diaryForm.value = { ...defaultDiaryForm, translations: { ko: { ...defaultDiaryForm.translations.ko }, ja: { ...defaultDiaryForm.translations.ja } } }
}

const saveDiary = async () => {
  try {
    const data = {
      title: diaryForm.value.title,
      destination_country: diaryForm.value.destinationCountry,
      destination_city: diaryForm.value.destinationCity,
      start_date: diaryForm.value.startDate,
      end_date: diaryForm.value.endDate,
      description: diaryForm.value.description,
      rating: diaryForm.value.rating,
      is_public: diaryForm.value.isPublic,
      translations: {
        ko: diaryForm.value.translations.ko,
        ja: diaryForm.value.translations.ja
      }
    }
    
    if (editingDiary.value) {
      await updateDiary(editingDiary.value.id, data)
    } else {
      await createDiary(data)
    }
    closeDiaryModal()
    await loadDiaries()
  } catch (e) {
    console.error('Failed to save diary', e)
    alert('Failed to save diary')
  }
}

const deleteDiary = async (id: string) => {
  if (!confirm('Delete this diary?')) return
  try {
    await removeDiary(id)
    await loadDiaries()
  } catch (e) {
    console.error('Failed to delete diary', e)
  }
}

// Plan functions
const openPlanModal = (plan?: TravelPlan) => {
  if (plan) {
    editingPlan.value = plan
    planForm.value = {
      destinationCountry: plan.destination.country,
      destinationCity: plan.destination.city,
      targetDate: plan.targetDate || '',
      duration: plan.duration || null,
      status: plan.status,
      budgetAmount: plan.budget?.amount || null,
      notes: plan.notes || '',
      translations: {
        ko: {
          destination_country: plan.translations?.ko?.destination_country || '',
          destination_city: plan.translations?.ko?.destination_city || '',
          notes: plan.translations?.ko?.notes || ''
        },
        ja: {
          destination_country: plan.translations?.ja?.destination_country || '',
          destination_city: plan.translations?.ja?.destination_city || '',
          notes: plan.translations?.ja?.notes || ''
        }
      }
    }
  }
  planLang.value = 'en'
  showPlanModal.value = true
}

const closePlanModal = () => {
  showPlanModal.value = false
  editingPlan.value = null
  planLang.value = 'en'
  planForm.value = { ...defaultPlanForm, translations: { ko: { ...defaultPlanForm.translations.ko }, ja: { ...defaultPlanForm.translations.ja } } }
}

const savePlan = async () => {
  try {
    const data = {
      destination_country: planForm.value.destinationCountry,
      destination_city: planForm.value.destinationCity,
      target_date: planForm.value.targetDate || null,
      duration: planForm.value.duration,
      status: planForm.value.status,
      budget_amount: planForm.value.budgetAmount,
      notes: planForm.value.notes,
      translations: {
        ko: planForm.value.translations.ko,
        ja: planForm.value.translations.ja
      }
    }
    
    if (editingPlan.value) {
      await updatePlan(editingPlan.value.id, data)
    } else {
      await createPlan(data)
    }
    closePlanModal()
    await loadPlans()
  } catch (e) {
    console.error('Failed to save plan', e)
    alert('Failed to save plan')
  }
}

const deletePlan = async (id: string) => {
  if (!confirm('Delete this plan?')) return
  try {
    await removePlan(id)
    await loadPlans()
  } catch (e) {
    console.error('Failed to delete plan', e)
  }
}

const formatDate = (date: string) => new Date(date).toLocaleDateString()
</script>

<style scoped>
.travel-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.travel-tab {
  font-size: 0.95rem;
  font-weight: 600;
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: #888;
  cursor: pointer;
  transition: all 0.2s ease;
}

.travel-tab:hover {
  color: #111;
}

.travel-tab.active {
  color: #111;
  border-bottom-color: #111;
}

.tab-actions {
  margin-bottom: 24px;
}

.form-field {
  margin-bottom: 16px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 4px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  font-size: 0.95rem;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-cancel {
  padding: 10px 20px;
  border: 1px solid #ddd;
  background: transparent;
  cursor: pointer;
}

.btn-save {
  padding: 10px 20px;
  background: #111;
  color: #fff;
  border: none;
  cursor: pointer;
}

.loading, .empty {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style>
