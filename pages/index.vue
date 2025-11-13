<script setup lang="ts">
import { gql } from '@apollo/client/core'
import { computed } from 'vue'

const GET_TAGS = gql`
  query Homepage {
    categories {
      id
      name
      slug
    }
    featuredPosts: posts(filter: {
      featured: true, limit: 3
    }) {
      id
      slug
      title
      content
      coverImageUrl
    }

    recentPosts: posts(filter: {
      featured: false
      published: true
      limit: 5
    }) {
      id
      title
      slug
      content
      coverImageUrl
    }

  }
`
const { data, pending, error } = await useAsyncQuery(GET_TAGS)

const categories = computed(() => data.value?.categories ?? [])

const featuredPosts = computed(() => data.value?.featuredPosts ?? []);

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
    <TagList v-else :tags="categories" />
  </section>

  <PostGrid
    v-if="featuredPosts.length"
    title="Featured articles"
    subtitle="Handpicked posts to get you started."
    :posts="featuredPosts"
    :excerpt-length="160"
  >
    <template #actions>
      <NuxtLink to="/blog" class="post-grid-section__view-all">
        View all posts →
      </NuxtLink>
    </template>
  </PostGrid>

  <PostGrid
    v-if="featuredPosts.length"
    title="Latest articles"
    subtitle="The newest updates from the CareValidate team."
    :posts="featuredPosts"
    :excerpt-length="140"
  >
    <template #actions>
      <NuxtLink to="/blog" class="post-grid-section__view-all">
        View all posts →
      </NuxtLink>
    </template>
  </PostGrid>
</template>