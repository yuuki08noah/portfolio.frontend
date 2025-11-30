<template>
  <section v-if="plan" class="plan-detail container">
    <header class="hero card">
      <div>
        <p class="eyebrow">Plan</p>
        <h1>{{ displayCity }}, {{ displayCountry }}</h1>
        <p class="subtitle" v-if="plan.targetDate">
          Target date: {{ formatDate(plan.targetDate) }} • {{ plan.duration }} days
        </p>
        <div class="meta">
          <span class="status" :class="plan.status">{{ plan.status }}</span>
          <span v-if="plan.budget" class="badge">
            Budget: {{ plan.budget.amount }} {{ plan.budget.currency }}
          </span>
        </div>
      </div>
      <div class="notes" v-if="displayNotes">
        <p class="eyebrow">Notes</p>
        <p class="subtitle">{{ displayNotes }}</p>
      </div>
    </header>

    <div class="grid grid-2">
      <div class="card">
        <p class="eyebrow">Checklist</p>
        <ul class="checklist">
          <li v-for="item in plan.checklist" :key="item.id">
            <input type="checkbox" :checked="item.completed" disabled />
            <span>{{ item.task }}</span>
            <span class="pill" :class="item.category">{{ item.category }}</span>
          </li>
        </ul>
      </div>
      <div class="card">
        <p class="eyebrow">Bucket List</p>
        <ul class="bucket">
          <li v-for="wish in plan.bucketList" :key="wish">• {{ wish }}</li>
        </ul>
      </div>
    </div>

    <div class="card">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Itinerary</p>
          <h2>Time slots ({{ plan.timeSlotDuration }}m)</h2>
        </div>
      </div>
      <div class="activities">
        <ActivityCard
          v-for="activity in activities || []"
          :key="activity.id"
          :activity="activity"
          :slot-duration="plan.timeSlotDuration || 30"
        />
        <p v-if="!activities?.length" class="empty">No activities yet.</p>
      </div>
    </div>
  </section>
  <p v-else class="empty container">Plan not found.</p>
</template>

<script setup lang="ts">
import ActivityCard from '~/components/travel/ActivityCard.vue'

const route = useRoute()
const { fetchPlan } = useTravelPlan()
const { fetchActivities } = useItinerary()
const { t } = useI18n()

const id = route.params.id as string
const { data: plan } = await useAsyncData(`plan-${id}`, () =>
  fetchPlan(id).then((res) => res.data)
)

const { data: activities } = await useAsyncData(`activities-${id}`, () =>
  fetchActivities(id).then((res) => res.data)
)

const displayCity = computed(() => t(
  plan.value?.destination.city || '',
  plan.value?.translations?.ko?.destination_city,
  plan.value?.translations?.ja?.destination_city
))
const displayCountry = computed(() => t(
  plan.value?.destination.country || '',
  plan.value?.translations?.ko?.destination_country,
  plan.value?.translations?.ja?.destination_country
))
const displayNotes = computed(() => t(
  plan.value?.notes || '',
  plan.value?.translations?.ko?.notes,
  plan.value?.translations?.ja?.notes
))

const formatDate = (date: string) => new Date(date).toLocaleDateString()
</script>

<style scoped>
.plan-detail {
  padding: var(--spacing-3xl) var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.hero {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-lg);
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.85rem;
  color: var(--color-accent);
  margin-bottom: var(--spacing-xs);
  font-weight: 700;
}

.subtitle {
  color: var(--color-gray-600);
}

.meta {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  margin-top: var(--spacing-sm);
}

.status {
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-full);
  background: var(--color-gray-100);
  text-transform: capitalize;
  font-weight: 700;
}

.status.planning { background: rgba(14, 165, 233, 0.12); color: #0369a1; }
.status.booked { background: rgba(16, 185, 129, 0.12); color: #047857; }
.status.completed { background: rgba(99, 102, 241, 0.12); color: #4f46e5; }
.status.cancelled { background: rgba(239, 68, 68, 0.12); color: #b91c1c; }

.badge {
  padding: 0.35rem 0.75rem;
  background: var(--color-gray-100);
  border-radius: var(--radius-full);
}

.notes {
  max-width: 320px;
  text-align: right;
}

.checklist, .bucket {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.checklist li {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.pill {
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
  background: var(--color-gray-100);
  font-size: 0.85rem;
  text-transform: capitalize;
}

.pill.booking { background: rgba(14, 165, 233, 0.15); }
.pill.document { background: rgba(249, 115, 22, 0.15); }
.pill.packing { background: rgba(99, 102, 241, 0.15); }

.activities {
  display: grid;
  gap: var(--spacing-md);
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.empty {
  color: var(--color-gray-600);
}
</style>
