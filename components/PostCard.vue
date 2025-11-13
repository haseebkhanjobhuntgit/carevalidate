<template>
  <article class="post-card">
    <NuxtLink :to="`/blog/${post.slug}`" class="post-card__link">
      <div v-if="post.coverImageUrl" class="post-card__image-wrapper">
        <NuxtImg
          :src="post.coverImageUrl"
          :alt="post.title"
          width="640"
          height="360"
          format="webp"
          class="post-card__image"
        />
      </div>

      <div class="post-card__body">
        <h3 class="post-card__title">
          {{ post.title }}
        </h3>

        <p class="post-card__excerpt">
          {{ clippedContent }}
        </p>

        <span class="post-card__cta">
          Read more →
        </span>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
type Post = {
  id: number | string;
  title: string;
  slug: string;
  content: string;
  coverImageUrl?: string | null;
};

const props = defineProps<{
  post: Post;
  maxChars?: number;
}>();

const maxChars = computed(() => props.maxChars ?? 140);

const clippedContent = computed(() => {
  if (!props.post.content) return "";
  const raw = props.post.content.replace(/<[^>]+>/g, ""); // strip HTML if any
  return raw.length > maxChars.value
    ? raw.slice(0, maxChars.value).trimEnd() + "..."
    : raw;
});
</script>

<style scoped>
.post-card {
  background: var(--card, #f5f6f8);
  border-radius: var(--radius, 12px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.post-card__link {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: inherit;
  text-decoration: none;
}

.post-card__image-wrapper {
  width: 100%;
  overflow: hidden;
  max-height: 220px;
}

.post-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.post-card__body {
  padding: 16px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.post-card__title {
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.3;
}

.post-card__excerpt {
  font-size: 0.9rem;
  color: var(--muted-text, #5b607a);
}

.post-card__cta {
  margin-top: auto;
  font-size: 0.85rem;
  font-weight: 500;
  opacity: 0.8;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
}
</style>
