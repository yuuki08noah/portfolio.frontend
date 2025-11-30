interface SiteSetting {
  key: string
  value: string
  valueKo?: string
}

export const useSiteSettings = () => {
  const { apiBase } = useApi()
  const { locale } = useI18n()

  const fetchSettings = async (): Promise<{ data: SiteSetting[] }> => {
    const response = await fetch(`${apiBase}/site_settings`)
    return response.json()
  }

  const getSetting = (settings: SiteSetting[], key: string): string => {
    const setting = settings.find(s => s.key === key)
    if (!setting) return ''
    if (locale.value === 'ko' && setting.valueKo) {
      return setting.valueKo
    }
    return setting.value || ''
  }

  const updateSetting = async (key: string, value: string, valueKo?: string) => {
    const response = await fetch(`${apiBase}/site_settings/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value, value_ko: valueKo })
    })
    return response.json()
  }

  const bulkUpdateSettings = async (settings: { key: string; value: string; value_ko?: string }[]) => {
    const response = await fetch(`${apiBase}/site_settings/bulk_update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings })
    })
    return response.json()
  }

  return {
    fetchSettings,
    getSetting,
    updateSetting,
    bulkUpdateSettings
  }
}
