export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['nuxt-graphql-server', '@prisma/nuxt', 'nuxt-apollo', '@nuxtjs/color-mode'],
  graphqlServer: {
    url: '/api/graphql'
  },
  apollo: {
    httpEndpoint: '/api/graphql'
  },
})