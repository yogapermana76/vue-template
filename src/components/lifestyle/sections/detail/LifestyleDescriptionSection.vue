<script setup lang="ts">
  import { ref } from 'vue'
  import { Button } from '@/components/ui/button'

  interface Props {
    title?: string
    description: string
    showMoreLabel?: string
    showLessLabel?: string
  }

  withDefaults(defineProps<Props>(), {
    title: 'Deskripsi',
    showMoreLabel: 'Selengkapnya',
    showLessLabel: 'Sembunyikan',
  })

  const isExpanded = ref(false)

  function toggleExpanded() {
    isExpanded.value = !isExpanded.value
  }
</script>

<template>
  <section class="flex flex-col gap-2 px-4">
    <h2 class="body-l-semibold text-slate-950">{{ title }}</h2>
    <p class="body-caption text-slate-700" :class="{ 'line-clamp-3': !isExpanded }">
      {{ description }}
    </p>
    <Button variant="tertiary" size="xs" class="h-auto w-fit p-0" @click="toggleExpanded">
      {{ isExpanded ? showLessLabel : showMoreLabel }}
    </Button>
  </section>
</template>
