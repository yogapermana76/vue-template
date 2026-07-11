<script setup lang="ts">
  defineProps<{
    title: string
    subtitle?: string
    width?: 'sm' | 'md' | 'lg'
  }>()
</script>

<template>
  <div
    :class="[
      'flex w-full flex-col gap-8',
      width === 'sm' && 'max-w-80',
      width === 'lg' && 'max-w-md',
      (!width || width === 'md') && 'max-w-95',
    ]"
  >
    <div class="flex flex-col gap-1.5">
      <div v-if="$slots.badge" class="mb-1">
        <slot name="badge" />
      </div>
      <h2 class="heading-l tracking-tight text-slate-900">{{ title }}</h2>
      <p v-if="subtitle" class="body-m text-neutral-500">{{ subtitle }}</p>
    </div>

    <slot />

    <div v-if="$slots.footer" class="body-caption text-center text-neutral-500">
      <slot name="footer" />
    </div>
  </div>
</template>
