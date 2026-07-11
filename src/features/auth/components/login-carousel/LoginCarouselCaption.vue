<script setup lang="ts">
  defineProps<{
    index: number
    total: number
    title: string
    description: string
  }>()
</script>

<template>
  <div
    class="animate-in fade-in slide-in-from-bottom-4 absolute inset-0 flex flex-col gap-3 duration-500"
  >
    <div
      class="pointer-events-auto inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-md"
    >
      <div class="size-1.5 animate-pulse rounded-full bg-teal-400" />
      <span class="body-caption-medium tracking-widest text-white/90 uppercase">
        {{ String(index + 1).padStart(2, '0') }} / {{ String(total).padStart(2, '0') }}
      </span>
    </div>
    <h2 class="text-3xl leading-tight font-bold tracking-tight text-white">
      {{ title }}
    </h2>
    <p class="body-l max-w-md leading-relaxed text-white/75">
      {{ description }}
    </p>
  </div>
</template>
