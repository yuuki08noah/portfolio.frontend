export type ThemePalette = {
  primary: string
  accent: string
  bg: string
  text: string
}

export type ThemeConfig = {
  id: string
  name: string
  greeting?: string
  palette: ThemePalette
}

export type CityConfig = {
  id: string
  name: string
  paletteOverlay?: Partial<ThemePalette>
  heroImage?: string
  images?: string[]
}

export const countries: Record<string, ThemeConfig> = {
  us: { id: 'us', name: 'USA', greeting: 'Hello', palette: { primary: '#1d4ed8', accent: '#ef4444', bg: '#ffffff', text: '#111827' } },
  jp: { id: 'jp', name: 'Japan', greeting: 'こんにちは', palette: { primary: '#b91c1c', accent: '#f59e0b', bg: '#ffffff', text: '#1f2937' } },
}

export const citiesByCountry: Record<string, CityConfig[]> = {
  us: [
    { 
      id: 'newyork', 
      name: 'New York', 
      paletteOverlay: { primary: '#1e3a8a' },
      heroImage: '/images/newyorksunset.jpg',
      images: [
        '/images/newyorksunset.jpg',
        '/images/newyorknight.jpg',
        '/images/newyorknight2.jpg',
        '/images/centralpark.jpg',
        '/images/bruklynbridge.jpg',
        '/images/timesquare_horizontal.jpg',
        '/images/timesquare_vertical.jpg',
      ]
    },
    { 
      id: 'sanfrancisco', 
      name: 'San Francisco', 
      paletteOverlay: { primary: '#0369a1' },
      heroImage: '/images/goldengatebridge1.jpg',
      images: [
        '/images/goldengatebridge1.jpg',
        '/images/goldengatebridge2.jpg',
        '/images/sftram.jpg',
      ]
    },
  ],
  jp: [
    { 
      id: 'tokyo', 
      name: 'Tokyo', 
      paletteOverlay: { primary: '#ef4444' },
      heroImage: '/images/tokyocityview.jpg',
      images: [
        '/images/tokyocityview.jpg',
        '/images/tokyonight.jpg',
        '/images/japantrain.jpg',
        '/images/japan_train_aural.jpg',
        '/images/kamakura.jpg',
      ]
    },
  ],
}

export const defaultCountryId = 'us'
export const defaultCityId = 'newyork'