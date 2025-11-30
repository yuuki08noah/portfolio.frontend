<template>
  <div class="theme-selector" ref="selectorRef">
    <!-- Trigger Button -->
    <button @click="toggleDropdown" class="theme-trigger">
      {{ currentCountryName }} - {{ currentCityName }}
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" class="arrow" :class="{ open: isOpen }">
        <path fill="currentColor" d="M6 8L2 4h8z"/>
      </svg>
    </button>

    <!-- Custom Dropdown Panel -->
    <transition name="dropdown">
      <div v-if="isOpen" class="dropdown-panel">
        <div class="dropdown-section">
          <label class="dropdown-label">Country</label>
          <div class="options-grid">
            <button
              v-for="c in countries"
              :key="c.id"
              @click="selectCountry(c.id)"
              class="option-btn"
              :class="{ active: country === c.id }"
            >
              {{ c.name }}
            </button>
          </div>
        </div>

        <div class="dropdown-divider"></div>

        <div class="dropdown-section">
          <label class="dropdown-label">City</label>
          <div class="options-grid">
            <button
              v-for="ct in cities"
              :key="ct.id"
              @click="selectCity(ct.id)"
              class="option-btn"
              :class="{ active: city === ct.id }"
            >
              {{ ct.name }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const { selectedCountry, selectedCity, setCountry, setCity, getCountries, getCities } = useTheme()

const country = selectedCountry
const city = selectedCity
const isOpen = ref(false)
const selectorRef = ref<HTMLElement | null>(null)

const countries = computed(() => getCountries())
const cities = computed(() => getCities(country.value))

const currentCountryName = computed(() => {
  const c = countries.value.find(c => c.id === country.value)
  return c?.name || 'Country'
})

const currentCityName = computed(() => {
  const c = cities.value.find(c => c.id === city.value)
  return c?.name || 'City'
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function selectCountry(id: string) {
  setCountry(id)
}

function selectCity(id: string) {
  setCity(id)
  isOpen.value = false
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  if (selectorRef.value && !selectorRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.theme-selector {
  position: relative;
}

.theme-trigger {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 6px 12px;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.theme-trigger:hover {
  background: var(--color-bg);
  border-color: var(--color-border);
}

.arrow {
  transition: transform var(--transition-fast);
}

.arrow.open {
  transform: rotate(180deg);
}

.dropdown-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 280px;
  background: var(--color-white);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: var(--spacing-md);
  z-index: 1000;
}

.dropdown-section {
  margin-bottom: var(--spacing-sm);
}

.dropdown-section:last-child {
  margin-bottom: 0;
}

.dropdown-label {
  display: block;
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-text);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--spacing-xs);
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: var(--spacing-xs);
}

.option-btn {
  padding: 6px 10px;
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-text);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: center;
}

.option-btn:hover {
  background: var(--color-white);
  border-color: var(--color-text);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.option-btn.active {
  background: var(--color-text);
  color: var(--color-white);
  border-color: var(--color-text);
  font-weight: 700;
}

.dropdown-divider {
  height: 1px;
  background: var(--color-border);
  margin: var(--spacing-sm) 0;
}

/* Transition animations */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>