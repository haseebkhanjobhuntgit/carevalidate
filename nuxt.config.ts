
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    'nuxt-graphql-server',
    '@prisma/nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/google-fonts',
    '@nuxtjs/apollo',
    '@nuxt/image'
  ],
  graphqlServer: {
    url: '/api/graphql'
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    storageKey: 'cv-theme'
  },
  apollo: {
    clients: {
      default: {
        httpEndpoint: 'http://localhost:3000/api/graphql'
      }
    },
  },
  css: ['~/assets/theme.css'],
  googleFonts: {
    families: {
      Parkinsans: true
    }
  }
})