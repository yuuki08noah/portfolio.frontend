import { fileURLToPath } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  alias: {
    '~': fileURLToPath(new URL('./', import.meta.url)),
    '@': fileURLToPath(new URL('./', import.meta.url)),
    '~/server': fileURLToPath(new URL('./server', import.meta.url))
  },
  pages: true,
  ssr: true,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    }
  ],

  css: ['~/assets/css/global.css'],

  app: {
    head: {
      title: 'Portfolio — A Journey to Myself',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A travel-themed portfolio showcasing my journey through development, experiences, and projects.' },
        { property: 'og:title', content: 'Portfolio — A Journey to Myself' },
        { property: 'og:description', content: 'Explore my journey through profile and projects.' },
        { property: 'og:type', content: 'website' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  runtimeConfig: {
    // Server-only runtime config
    smtpHost: process.env.SMTP_HOST || '',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    hireToEmail: process.env.HIRE_TO_EMAIL || 'noah8.technologies@proton.me',
    backendApiBase: process.env.BACKEND_API_BASE || 'http://localhost:4000',

    public: {
      // Public runtime config (exposed to client)
      defaultCountryTheme: process.env.DEFAULT_COUNTRY_THEME || 'us',
      defaultCity: process.env.DEFAULT_CITY || 'new-york',
      backendApiBase: process.env.NUXT_PUBLIC_BACKEND_API_BASE || process.env.BACKEND_API_BASE || 'http://localhost:4000'
    }
  }
})
