import { ref, watchEffect, onMounted } from 'vue'
import { countries, citiesByCountry, defaultCountryId, defaultCityId } from '../config/themes'
import type { ThemePalette } from '../config/themes'

const STORAGE_KEYS = {
  country: 'countryTheme',
  city: 'cityTheme',
}

export function useTheme() {
  const selectedCountry = ref<string>(defaultCountryId)
  const selectedCity = ref<string>(defaultCityId)

  // Initialize from localStorage on client to avoid SSR/client hydration mismatch
  onMounted(() => {
    try {
      const savedCountry = localStorage.getItem(STORAGE_KEYS.country)
      const savedCity = localStorage.getItem(STORAGE_KEYS.city)
      if (savedCountry && countries[savedCountry]) {
        selectedCountry.value = savedCountry
      }
      const cityList = citiesByCountry[selectedCountry.value] || []
      if (savedCity && cityList.find(c => c.id === savedCity)) {
        selectedCity.value = savedCity
      }
    } catch (_) {
      // ignore storage access errors
    }
  })

  function applyPalette(palette: ThemePalette) {
    const root = document.documentElement
    root.style.setProperty('--color-primary', palette.primary)
    root.style.setProperty('--color-accent', palette.accent)
    root.style.setProperty('--color-bg', palette.bg)
    root.style.setProperty('--color-text', palette.text)
  }

  function applyAttributes() {
    const root = document.documentElement
    root.setAttribute('data-theme', selectedCountry.value)
    root.setAttribute('data-city', selectedCity.value)
  }

  function getPalette(): ThemePalette {
    const countryCfg = countries[selectedCountry.value]
    const defaultCfg = countries[defaultCountryId]
    const basePalette = countryCfg?.palette ?? defaultCfg?.palette ?? {
      primary: '#2c7a7b',
      accent: '#d97706',
      bg: '#ffffff',
      text: '#111827',
    }

    const cityList = citiesByCountry[selectedCountry.value] || []
    const cityCfg = cityList.find(c => c.id === selectedCity.value)

    if (cityCfg?.paletteOverlay) {
      return { ...basePalette, ...cityCfg.paletteOverlay }
    }

    return basePalette
  }

  function setCountry(id: string) {
    if (!countries[id]) return
    selectedCountry.value = id
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.country, id)
    }
    // Reset city to first available of chosen country if current city not in list
    const cityList = citiesByCountry[id] || []
    if (!cityList.find(c => c.id === selectedCity.value)) {
      const first = cityList[0]
      if (first) setCity(first.id)
    }
  }

  function setCity(id: string) {
    const cityList = citiesByCountry[selectedCountry.value] || []
    if (!cityList.find(c => c.id === id)) return
    selectedCity.value = id
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.city, id)
    }
  }

  function getCountries() {
    return Object.values(countries)
  }

  function getCities(countryId?: string) {
    return citiesByCountry[countryId || selectedCountry.value] || []
  }

  function getCurrentCityConfig() {
    const cityList = citiesByCountry[selectedCountry.value] || []
    return cityList.find(c => c.id === selectedCity.value)
  }

  function getCityImages() {
    const city = getCurrentCityConfig()
    return city?.images || []
  }

  function getHeroImage() {
    const city = getCurrentCityConfig()
    return city?.heroImage || '/images/newyorksunset.jpg'
  }

  watchEffect(() => {
    applyPalette(getPalette())
    applyAttributes()
  })

  return { selectedCountry, selectedCity, setCountry, setCity, getCountries, getCities, getCurrentCityConfig, getCityImages, getHeroImage }
}