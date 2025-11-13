<script setup lang="ts">
import { gql } from '@apollo/client/core'
import { computed, onMounted } from 'vue'

const GET_TAGS = gql`
  query Homepage {
    tags {
      id
      name
      slug
    }
  }
`
const { data, pending, error } = await useAsyncQuery(GET_TAGS)

const tags = computed(() => data.value?.tags ?? [])

onMounted(() => {
  console.log('@--> tags (client)', tags.value)
})
</script>


<template>
  <Banner
    title="Welcome, to the CareValidate blog"
    subtitle="Your AI-Powered, Digital Health Business Partner."
    cta-label="Book a demo"
    cta-href="/contact"
  />

  <section style="margin-top:24px">
    <div v-if="pending">Loading tags…</div>
    <div v-else-if="error">Failed to load tags.</div>
    <TagList v-else :tags="tags" />
  </section>


</template>