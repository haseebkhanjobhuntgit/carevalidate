<template>
  <section class="post-grid-section">
    <header class="post-grid-section__header">
      <div>
        <h2 class="post-grid-section__title">
          {{ title }}
        </h2>
        <p v-if="subtitle" class="post-grid-section__subtitle">
          {{ subtitle }}
        </p>
      </div>

      <slot name="actions" />
    </header>

    <div class="post-grid-section__grid">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
        :max-chars="excerptLength"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import PostCard from "@/components/PostCard.vue";
import { computed } from "vue";

type Post = {
  id: number | string;
  title: string;
  slug: string;
  content: string;
  coverImageUrl?: string | null;
};

const props = defineProps<{
  title: string;
  subtitle?: string;
  posts: Post[];
  excerptLength?: number;
}>();

const excerptLength = computed(() => props.excerptLength ?? 140);
</script>

<style scoped>
.post-grid-section {
  max-width: 1280px;
  margin-inline: auto;
  margin-block: 40px;
}

.post-grid-section__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.post-grid-section__title {
  font-size: 1.4rem;
  font-weight: 700;
}

.post-grid-section__subtitle {
  margin-top: 4px;
  font-size: 0.95rem;
  color: var(--muted-text, #5b607a);
}

.post-grid-section__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

@media (max-width: 1024px) {
  .post-grid-section__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .post-grid-section__grid {
    grid-template-columns: 1fr;
  }
}
</style>
