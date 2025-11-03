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
    <button
      v-for="tag in tags"
      :key="tag.id"
      class="tag-pill"
      :class="{ active: selected.includes(tag.slug) }"
      @click="toggle(tag)"
    >
      {{ tag.name }}
    </button>
  </div>
</template>
