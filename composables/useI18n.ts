export type Locale = 'en' | 'ko' | 'ja'

export const useI18n = () => {
    const locale = useState<Locale>('locale', () => {
        if (import.meta.client) {
            return (localStorage.getItem('locale') as Locale) || 'en'
        }
        return 'en'
    })

    const setLocale = (newLocale: Locale) => {
        locale.value = newLocale
        if (import.meta.client) {
            localStorage.setItem('locale', newLocale)
        }
    }

    const cycleLocale = () => {
        const locales: Locale[] = ['en', 'ko', 'ja']
        const currentIndex = locales.indexOf(locale.value)
        const nextIndex = (currentIndex + 1) % locales.length
        setLocale(locales[nextIndex])
    }

    // Legacy toggle for backward compatibility
    const toggleLocale = () => {
        const newLocale = locale.value === 'en' ? 'ko' : 'en'
        setLocale(newLocale)
    }

    const t = (en: string, ko?: string, ja?: string): string => {
        if (locale.value === 'ko' && ko !== undefined) {
            return ko
        }
        if (locale.value === 'ja' && ja !== undefined) {
            return ja
        }
        return en
    }

    const localeLabel = computed(() => {
        switch (locale.value) {
            case 'ko': return '한국어'
            case 'ja': return '日本語'
            default: return 'English'
        }
    })

    return {
        locale,
        setLocale,
        toggleLocale,
        cycleLocale,
        t,
        localeLabel
    }
}
