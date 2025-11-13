
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
  vite: {
    resolve: {
      alias: {
        '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js',
      },
    },
  },
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
        httpEndpoint: 'https://carevalidate.vercel.app/api/graphql'
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