<script setup lang="ts">
import { gql } from "@apollo/client/core";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const searchTerm = ref(
  typeof route.query.q === "string" ? route.query.q : ""
);

const debouncedTerm = ref(searchTerm.value);
let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

watch(
  searchTerm,
  (value) => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      debouncedTerm.value = value.trim();
    }, 250);
  },
  { immediate: true }
);

watch(
  () => route.query.q,
  (q) => {
    if (typeof q === "string" && q !== searchTerm.value) {
      searchTerm.value = q;
    }
  }
);

const SEARCH_POSTS = gql`
  query SearchPosts($search: String) {
    posts(filter: { published: true, search: $search }) {
      id
      title
      slug
      content
      coverImageUrl
    }
  }
`;

const variables = computed(() => ({
  search: debouncedTerm.value || null,
}));

const { data, pending, error, refresh } = await useAsyncQuery(
  SEARCH_POSTS,
  variables
);

const posts = computed(() => data.value?.posts ?? []);

watch(
  () => debouncedTerm.value,
  () => {
    refresh();
  }
);
</script>

<template>
  <main>
    <Banner
      :title="searchTerm ? `Search results for “${searchTerm}”` : 'Search the blog'"
      :subtitle="
        searchTerm
          ? 'Showing posts matching your query.'
          : 'Type a keyword to find relevant articles.'
      "
      min-height="18vh"
    />

    <section style="margin-top: 24px">
      <form class="search-page__form" @submit.prevent>
        <input
          v-model="searchTerm"
          type="search"
          placeholder="Search blog posts…"
          class="search-page__input"
        />
      </form>
    </section>

    <section style="margin-top: 24px">
      <div v-if="pending">Searching…</div>
      <div v-else-if="error">Something went wrong while searching.</div>

      <PostGrid
        v-else-if="posts.length"
        title="Matching articles"
        :subtitle="
          searchTerm
            ? 'These posts match your search query.'
            : 'Latest published posts.'
        "
        :posts="posts"
        :excerpt-length="160"
      >
        <template #actions>
          <NuxtLink to="/blog" class="post-grid-section__view-all">
            View all posts →
          </NuxtLink>
        </template>
      </PostGrid>

      <p v-else>
        {{ searchTerm ? 'No posts matched your search.' : 'No posts published yet.' }}
      </p>
    </section>
  </main>
</template>

<style scoped>
.search-page__form {
  max-width: 520px;
  margin: 0 auto;
}

.search-page__input {
  width: 100%;
  border-radius: 999px;
  border: 1px solid var(--muted);
  background: color-mix(in srgb, var(--bg) 96%, #ffffff 4%);
  padding: 10px 16px;
  font-size: 0.95rem;
  outline: none;
  color: var(--text);
}

.search-page__input::placeholder {
  opacity: 0.6;
}

.search-page__input:focus {
  border-color: var(--accent, #3daaab);
}
</style>
