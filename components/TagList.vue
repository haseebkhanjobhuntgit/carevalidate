<script setup lang="ts">
import { ref } from 'vue'

interface Tag {
  id: number
  name: string
  slug: string
}

const props = defineProps<{
  tags: Tag[]
  modelValue?: string[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const selected = ref<string[]>(props.modelValue ?? [])

function toggle(tag: Tag) {
  const exists = selected.value.includes(tag.slug)
  selected.value = exists
    ? selected.value.filter(s => s !== tag.slug)
    : [...selected.value, tag.slug]

  emit('update:modelValue', selected.value)
}
</script>

<template>
  <div class="taglist">
    <NuxtLink
      v-for="tag in tags"
      :key="tag.id"
      class="tag-pill"
      :class="{ active: selected.includes(tag.slug) }"
      :to="`/category/${tag.slug}`"
      @click.native="toggle(tag)"
    >
      {{ tag.name }}
    </NuxtLink>
  </div>
</template>

<style scoped>
.taglist {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-pill {
  padding: 6px 12px;
  border-radius: 20px;
  background: var(--card);
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;
}

.tag-pill.active {
  background: var(--accent);
  color: white;
}
</style>
