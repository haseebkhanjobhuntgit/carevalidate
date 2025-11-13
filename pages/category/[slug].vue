<script setup lang="ts">
import { gql } from "@apollo/client/core";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import PostGrid from "@/components/PostGrid.vue";

const PAGE_SIZE = 12;

const route = useRoute();

const slug = computed(() => {
  const value = route.params.slug;
  return Array.isArray(value) ? value[0] : (value as string);
});

const CATEGORY_PAGE_QUERY = gql`
    query CategoryPage($categorySlugs: [String!], $limit: Int, $offset: Int) {
    posts(
        filter: {
        categorySlugs: $categorySlugs
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

    categories {
        id
        name
        slug
    }
    }
`;

const page = ref(1);

const variables = computed(() => ({
  slug: slug.value,
  categorySlugs: [slug.value],
  limit: PAGE_SIZE + 1,
  offset: (page.value - 1) * PAGE_SIZE,
}));

const { data, pending, error, refresh } = await useAsyncQuery(
  CATEGORY_PAGE_QUERY,
  variables
);

const categories = computed(() => data.value?.categories ?? []);
const rawPosts = computed(() => data.value?.posts ?? []);

const category = computed(() =>
  categories.value.find((c: any) => c.slug === slug.value) ?? null
);

const hasNextPage = computed(() => rawPosts.value.length > PAGE_SIZE);
const visiblePosts = computed(() => rawPosts.value.slice(0, PAGE_SIZE));

watch(
  [slug, page],
  () => {
    refresh();
  },
  { deep: true }
);

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
      :title="category ? category.name : 'Category'"
      :subtitle="
        category
          ? `Articles filed under “${category.name}”.`
          : 'Articles by category.'
      "
      min-height="18vh"
    />

    <section v-if="pending" class="category-page__state">
      Loading category…
    </section>

    <section v-else-if="error" class="category-page__state">
      Something went wrong while loading this category.
    </section>

    <section
      v-else-if="!visiblePosts.length && !category"
      class="category-page__state"
    >
      Category not found.
    </section>

    <section v-else class="category-page__content">
      <PostGrid
        v-if="visiblePosts.length"
        :title="'Category articles'"
        subtitle="Browse articles in this category."
        :posts="visiblePosts"
        :excerpt-length="160"
      />

      <p v-else>No articles in this category yet.</p>

      <div
        v-if="visiblePosts.length"
        class="pagination"
      >
        <button
          type="button"
          class="pagination__btn"
          :disabled="page === 1"
          @click="prevPage"
        >
          Previous
        </button>

        <span class="pagination__page">
          Page {{ page }}
        </span>

        <button
          type="button"
          class="pagination__btn"
          :disabled="!hasNextPage"
          @click="nextPage"
        >
          Next
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.category-page__state {
  max-width: 720px;
  margin: 32px auto;
  padding: 0 20px;
  font-size: 0.95rem;
  opacity: 0.8;
}

.category-page__content {
  max-width: 960px;
  margin: 24px auto 48px;
  padding: 0 20px;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.pagination__btn {
  border-radius: 999px;
  border: 1px solid var(--muted);
  padding: 6px 12px;
  font-size: 0.85rem;
  background: transparent;
  cursor: pointer;
  color: var(--text);
}

.pagination__btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.pagination__page {
  font-size: 0.9rem;
  opacity: 0.8;
}
</style>
