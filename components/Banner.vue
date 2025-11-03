<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  minHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  align: 'center',
  minHeight: '10vh',
})

const classes = computed(() => [
  'cv-banner',
].filter(Boolean).join(' '))

const style = computed<Record<string, string>>(() => {
  const s: Record<string, string> = {}
  if (props.minHeight) s.minHeight = props.minHeight
  return s
})
</script>

<template>
  <section :class="classes" :style="style">
    <div class="cv-banner__inner">
      <h1 v-if="title" class="cv-banner__title">{{ title }}</h1>
      <p v-if="subtitle" class="cv-banner__subtitle">{{ subtitle }}</p>
    </div>
  </section>
</template>
