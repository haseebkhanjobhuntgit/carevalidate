<script setup lang="ts">
import { gql } from "@apollo/client/core";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useRequestURL } from "#app";
import PostGrid from "@/components/PostGrid.vue";

const route = useRoute();
const slug = route.params.slug as string;

/**
 * Main post query
 */
const GET_POST = gql`
  query PostPage($slug: String!) {
    post(slug: $slug) {
      id
      title
      slug
      content
      coverImageUrl
      createdAt
      updatedAt

      author {
        id
        name
      }

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
    }
  }
`;

const { data, pending, error } = await useAsyncQuery(GET_POST, { slug });

const post = computed(() => data.value?.post ?? null);

const GET_RELATED_POSTS = gql`
  query RelatedPosts(
    $categorySlugs: [String!]
    $tagSlugs: [String!]
    $limit: Int
  ) {
    posts(
      filter: {
        published: true
        categorySlugs: $categorySlugs
        tagSlugs: $tagSlugs
        limit: $limit
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

// Build variables for related posts based on the main post's categories/tags
const relatedVariables = computed(() => {
  const p = post.value;
  if (!p) {
    return {
      categorySlugs: null,
      tagSlugs: null,
      limit: 4,
    };
  }

  const categorySlugs = (p.categories ?? []).map((c: any) => c.slug);
  const tagSlugs = (p.tags ?? []).map((t: any) => t.slug);

  return {
    categorySlugs: categorySlugs.length ? categorySlugs : null,
    tagSlugs: tagSlugs.length ? tagSlugs : null,
    limit: 4, // fetch a few, we'll slice/filter client-side
  };
});

// Second query: related posts
const {
  data: relatedData,
  pending: relatedPending,
  error: relatedError,
} = await useAsyncQuery(GET_RELATED_POSTS, relatedVariables);

// Final related posts list: exclude the current post, cap at 3
const relatedPosts = computed(() => {
  const p = post.value;
  if (!p) return [];

  const all = relatedData.value?.posts ?? [];
  return all.filter((rp: any) => rp.slug !== p.slug).slice(0, 3);
});

/**
 * Share logic
 */
const requestUrl = useRequestURL();

const shareUrl = computed(() => requestUrl.href);
const shareText = computed(
  () => post.value?.title ?? "CareValidate blog article"
);

const canNativeShare = computed(
  () =>
    typeof navigator !== "undefined" &&
    typeof (navigator as any).share === "function"
);

const shareOnTwitter = () => {
  if (!post.value) return;
  const url = encodeURIComponent(shareUrl.value);
  const text = encodeURIComponent(shareText.value);
  const shareLink = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
  window.open(shareLink, "_blank", "noopener");
};

const shareOnLinkedIn = () => {
  if (!post.value) return;
  const url = encodeURIComponent(shareUrl.value);
  const shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  window.open(shareLink, "_blank", "noopener");
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    console.log("Link copied to clipboard");
  } catch (e) {
    console.error("Failed to copy link", e);
  }
};

const nativeShare = async () => {
  if (!canNativeShare.value || !post.value) return;
  try {
    await (navigator as any).share({
      title: shareText.value,
      url: shareUrl.value,
    });
  } catch (e) {
    console.warn("Native share cancelled/failed", e);
  }
};
</script>

<template>
  <main>
    <!-- States -->
    <section v-if="pending" class="post-detail__state">
      Loading article…
    </section>

    <section v-else-if="error" class="post-detail__state">
      Something went wrong while loading this article.
    </section>

    <section v-else-if="!post" class="post-detail__state">
      Article not found.
    </section>

    <!-- Main article -->
    <section v-else class="post-detail">
      <div v-if="post.coverImageUrl" class="post-detail__cover">
        <img :src="post.coverImageUrl" :alt="post.title" />
      </div>

      <header class="post-detail__header">
        <h1 class="post-detail__title">
          {{ post.title }}
        </h1>

        <div class="post-detail__meta">
          <NuxtLink :to="`/blog/author/${post.author.email}`">
            By {{ post.author.name }}
          </NuxtLink>
        </div>

        <div v-if="post.categories?.length" class="post-detail__chips">
          <span class="post-detail__chip-label">Categories:</span>
          <span
            v-for="cat in post.categories"
            :key="cat.id"
            class="post-detail__chip"
          >
            {{ cat.name }}
          </span>
        </div>

        <div v-if="post.tags?.length" class="post-detail__chips">
          <span class="post-detail__chip-label">Tags:</span>
          <span
            v-for="tag in post.tags"
            :key="tag.id"
            class="post-detail__chip post-detail__chip--tag"
          >
            {{ tag.name }}
          </span>
        </div>

        <!-- Share bar -->
        <div class="post-detail__share">
          <span class="post-detail__share-label">Share:</span>
          <button
            type="button"
            class="post-detail__share-btn"
            @click="shareOnTwitter"
          >
            X
          </button>
          <button
            type="button"
            class="post-detail__share-btn"
            @click="shareOnLinkedIn"
          >
            LinkedIn
          </button>
          <button
            type="button"
            class="post-detail__share-btn"
            @click="copyLink"
          >
            Copy link
          </button>
          <button
            v-if="canNativeShare"
            type="button"
            class="post-detail__share-btn post-detail__share-btn--ghost"
            @click="nativeShare"
          >
            Share…
          </button>
        </div>
      </header>

      <article class="post-detail__body">
        <div v-html="post.content" class="post-detail__content" />
      </article>
    </section>

    <!-- Related posts -->
    <section
      v-if="post && !relatedPending && !relatedError && relatedPosts.length"
      class="post-detail__related"
    >
      <PostGrid
        title="Related articles"
        subtitle="More posts you might find useful."
        :posts="relatedPosts"
        :excerpt-length="140"
      />
    </section>
  </main>
</template>

<style scoped>
.post-detail {
  max-width: 720px;
  margin: 32px auto 48px;
  padding: 0 20px;
}

.post-detail__state {
  max-width: 720px;
  margin: 32px auto;
  padding: 0 20px;
  font-size: 0.95rem;
  opacity: 0.8;
}

.post-detail__cover {
  margin-bottom: 20px;
  border-radius: 16px;
  overflow: hidden;
  background: var(--card);
}

.post-detail__cover img {
  display: block;
  width: 100%;
  height: auto;
}

.post-detail__header {
  margin-bottom: 24px;
}

.post-detail__title {
  font-size: 2rem;
  line-height: 1.25;
  font-weight: 700;
  margin-bottom: 8px;
}

.post-detail__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.9rem;
  opacity: 0.75;
  margin-bottom: 12px;
}

.post-detail__meta-item::before {
  content: "•";
  margin: 0 4px 0 0;
}
.post-detail__meta-item:first-of-type::before {
  content: "";
  margin: 0;
}

.post-detail__chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  margin-bottom: 6px;
}

.post-detail__chip-label {
  opacity: 0.7;
}

.post-detail__chip {
  border-radius: 999px;
  border: 1px solid var(--muted);
  padding: 2px 8px;
  font-size: 0.8rem;
  opacity: 0.9;
}

.post-detail__chip--tag {
  background: var(--card);
}

/* Share bar */
.post-detail__share {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  margin-bottom: 8px;
  font-size: 0.85rem;
}

.post-detail__share-label {
  opacity: 0.7;
}

.post-detail__share-btn {
  border-radius: 999px;
  border: 1px solid var(--muted);
  padding: 4px 10px;
  font-size: 0.8rem;
  background: transparent;
  cursor: pointer;
  color: var(--text);
}

.post-detail__share-btn--ghost {
  border-style: dashed;
  opacity: 0.8;
}

/* Body */
.post-detail__body {
  margin-top: 24px;
  line-height: 1.7;
  font-size: 0.98rem;
}

.post-detail__content :deep(p) {
  margin-bottom: 1em;
}

.post-detail__content :deep(h2) {
  margin-top: 1.6em;
  margin-bottom: 0.6em;
  font-size: 1.4rem;
}

.post-detail__content :deep(ul),
.post-detail__content :deep(ol) {
  margin-left: 1.25em;
  margin-bottom: 1em;
}

/* Related */
.post-detail__related {
  max-width: 960px;
  margin: 16px auto 48px;
  padding: 0 20px;
}
</style>
