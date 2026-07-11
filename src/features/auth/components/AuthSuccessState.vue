<script setup lang="ts">
  import { CircleCheck } from 'lucide-vue-next'

  defineProps<{
    title: string
    description?: string
  }>()
</script>

<template>
  <div class="flex flex-col items-center gap-4 text-center">
    <div
      class="bg-success-50 text-success-600 flex size-16 items-center justify-center rounded-full"
    >
      <CircleCheck class="size-8" />
    </div>
    <div class="flex flex-col gap-1.5">
      <h3 class="heading-s text-slate-900">{{ title }}</h3>
      <p v-if="description" class="body-m max-w-sm text-neutral-500">
        {{ description }}
      </p>
    </div>
    <div v-if="$slots.default" class="mt-2 flex w-full flex-col gap-2">
      <slot />
    </div>
  </div>
</template>
