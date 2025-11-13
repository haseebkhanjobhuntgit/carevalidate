<script setup lang="ts">
import { gql } from "@apollo/client/core";
import { computed, ref, watch } from "vue";

const PAGE_SIZE = 12;

const GET_BLOG_PAGE = gql`
  query BlogPage(
    $categorySlugs: [String!]
    $tagSlugs: [String!]
    $limit: Int
    $offset: Int
  ) {
    categories {
      id
      name
      slug
    }
    tags {
      id
      name
      slug
    }
    posts(
      filter: {
        published: true
        categorySlugs: $categorySlugs
        tagSlugs: $tagSlugs
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

const selectedCategorySlugs = ref<string[]>([]);
const selectedTagSlugs = ref<string[]>([]);

const page = ref(1);

const variables = computed(() => ({
  categorySlugs: selectedCategorySlugs.value.length
    ? selectedCategorySlugs.value
    : null,
  tagSlugs: selectedTagSlugs.value.length ? selectedTagSlugs.value : null,
  limit: PAGE_SIZE + 1,
  offset: (page.value - 1) * PAGE_SIZE,
}));

const { data, pending, error, refresh } = await useAsyncQuery(
  GET_BLOG_PAGE,
  variables
);

const categories = computed(() => data.value?.categories ?? []);
const tags = computed(() => data.value?.tags ?? []);

const rawPosts = computed(() => data.value?.posts ?? []);

const hasNextPage = computed(() => rawPosts.value.length > PAGE_SIZE);

const visiblePosts = computed(() => rawPosts.value.slice(0, PAGE_SIZE));

watch(
  [selectedCategorySlugs, selectedTagSlugs, page],
  () => {
    refresh();
  },
  { deep: true }
);

watch(
  [selectedCategorySlugs, selectedTagSlugs],
  () => {
    page.value = 1;
  },
  { deep: true }
);

const toggleCategory = (slug: string) => {
  const idx = selectedCategorySlugs.value.indexOf(slug);
  if (idx === -1) {
    selectedCategorySlugs.value.push(slug);
  } else {
    selectedCategorySlugs.value.splice(idx, 1);
  }
};

const toggleTag = (slug: string) => {
  const idx = selectedTagSlugs.value.indexOf(slug);
  if (idx === -1) {
    selectedTagSlugs.value.push(slug);
  } else {
    selectedTagSlugs.value.splice(idx, 1);
  }
};

const clearCategories = () => {
  selectedCategorySlugs.value = [];
};

const clearTags = () => {
  selectedTagSlugs.value = [];
};

const nextPage = () => {
  if (hasNextPage.value) {
    page.value += 1;
  }
};

const prevPage = () => {
  if (page.value > 1) {
    page.value -= 1;
  }
};
</script>

<template>
  <main>
    <Banner
      title="All articles"
      subtitle="Explore every post from the CareValidate team."
      min-height="18vh"
    />

    <section class="blog-filters">
      <div class="blog-filters__group">
        <h3 class="blog-filters__label">Categories</h3>
        <div class="blog-filters__pills">
          <button
            type="button"
            class="filter-pill"
            :class="{ 'filter-pill--active': !selectedCategorySlugs.length }"
            @click="clearCategories"
          >
            All
          </button>
          <button
            v-for="cat in categories"
            :key="cat.id"
            type="button"
            class="filter-pill"
            :class="{
              'filter-pill--active': selectedCategorySlugs.includes(cat.slug),
            }"
            @click="toggleCategory(cat.slug)"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>

      <div class="blog-filters__group">
        <h3 class="blog-filters__label">Tags</h3>
        <div class="blog-filters__pills">
          <button
            type="button"
            class="filter-pill"
            :class="{ 'filter-pill--active': !selectedTagSlugs.length }"
            @click="clearTags"
          >
            All
          </button>
          <button
            v-for="tag in tags"
            :key="tag.id"
            type="button"
            class="filter-pill"
            :class="{
              'filter-pill--active': selectedTagSlugs.includes(tag.slug),
            }"
            @click="toggleTag(tag.slug)"
          >
            {{ tag.name }}
          </button>
        </div>
      </div>
    </section>

    <section class="pagination__wrapper">
      <div v-if="pending">Loading posts…</div>
      <div v-else-if="error">Failed to load posts.</div>

      <template v-else>
        <PostGrid
          v-if="visiblePosts.length"
          title="All articles"
          subtitle="Use the filters above to narrow down the content."
          :posts="visiblePosts"
          :excerpt-length="160"
        >
          <template #actions>
            <span class="pagination__summary">
              Page {{ page }}
            </span>
          </template>
        </PostGrid>

        <p v-else>No articles match the selected filters.</p>

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
      </template>
    </section>
  </main>
</template>

<style scoped>
.blog-filters {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 20px;
}

.blog-filters__group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.blog-filters__label {
  font-size: 0.9rem;
  font-weight: 600;
  opacity: 0.8;
}

.blog-filters__pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-pill {
  border-radius: 999px;
  border: 1px solid var(--muted);
  padding: 4px 10px;
  font-size: 0.85rem;
  background: transparent;
  cursor: pointer;
  color: var(--text);
  opacity: 0.8;
}

.filter-pill--active {
  background: var(--accent, #3daaab);
  border-color: var(--accent, #3daaab);
  color: #fff;
  opacity: 1;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.pagination__wrapper {
    margin-block: 24px;
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

.pagination__summary {
  font-size: 0.85rem;
  opacity: 0.7;
}

@media (max-width: 640px) {
  .blog-filters {
    padding: 0 16px;
  }
}
</style>
