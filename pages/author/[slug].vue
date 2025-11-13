<script setup lang="ts">
import { gql } from "@apollo/client/core";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import PostGrid from "@/components/PostGrid.vue";

const PAGE_SIZE = 12;

const route = useRoute();
const email = computed(() => {
  const v = route.params.slug;
  return Array.isArray(v) ? v[0] : (v as string);
});

const AUTHOR_QUERY = gql`
  query AuthorPage($email: String!, $limit: Int, $offset: Int) {
    author(email: $email) {
      id
      name
      email
      bio
    }

    posts(
      filter: {
        published: true
        authorEmail: $email
        limit: $limit
        offset: $offset
      }
    ) {
      id
      title
      slug
      content
      coverImageUrl
    }
  }
`;

const page = ref(1);

const variables = computed(() => ({
  email: email.value,
  limit: PAGE_SIZE + 1,
  offset: (page.value - 1) * PAGE_SIZE,
}));

const { data, pending, error, refresh } = await useAsyncQuery(
  AUTHOR_QUERY,
  variables
);

const author = computed(() => data.value?.author ?? null);
const rawPosts = computed(() => data.value?.posts ?? []);
const visiblePosts = computed(() => rawPosts.value.slice(0, PAGE_SIZE));
const hasNextPage = computed(() => rawPosts.value.length > PAGE_SIZE);

watch([email, page], () => refresh());

const nextPage = () => {
  if (hasNextPage.value) page.value += 1;
};
const prevPage = () => {
  if (page.value > 1) page.value -= 1;
};
</script>

<template>
  <main>
    <Banner
      :title="author ? author.name : 'Author'"
      :subtitle="
        author
          ? `Articles written by ${author.name}.`
          : 'Browse articles by author.'
      "
      min-height="18vh"
    />

    <section v-if="pending" class="author__state">
      Loading author…
    </section>

    <section v-else-if="error" class="author__state">
      Something went wrong while loading this author.
    </section>

    <section v-else-if="!author" class="author__state">
      Author not found.
    </section>

    <section v-else class="author__content">
      <div class="author__info">
        <img
          v-if="author.avatarUrl"
          :src="author.avatarUrl"
          :alt="author.name"
          class="author__avatar"
        />

        <p v-if="author.bio" class="author__bio">
          {{ author.bio }}
        </p>
      </div>

      <!-- Posts -->
      <PostGrid
        v-if="visiblePosts.length"
        title="Articles"
        subtitle="Written by this author"
        :posts="visiblePosts"
        :excerpt-length="160"
      />

      <p v-else class="author__state">No articles yet.</p>

      <!-- Pagination -->
      <div v-if="visiblePosts.length" class="pagination">
        <button @click="prevPage" :disabled="page === 1">Previous</button>
        <span>Page {{ page }}</span>
        <button @click="nextPage" :disabled="!hasNextPage">Next</button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.author__state {
  max-width: 720px;
  margin: 32px auto;
  padding: 0 20px;
  opacity: 0.8;
}

.author__content {
  max-width: 960px;
  margin: 24px auto 48px;
  padding: 0 20px;
}

.author__info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.author__avatar {
  width: 96px;
  height: 96px;
  border-radius: 999px;
  object-fit: cover;
}

.author__bio {
  font-size: 0.95rem;
  opacity: 0.85;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
}

.pagination button {
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid var(--muted);
  background: transparent;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: default;
}
</style>
