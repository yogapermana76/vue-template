<script setup lang="ts">
  import type { Component } from 'vue'

  interface ProgramInfo {
    title: string
    description: string
  }

  interface Stat {
    id: string
    label: string
    value: string
    icon: Component
  }

  interface Props {
    programInfo: ProgramInfo
    stats: Stat[]
  }

  defineProps<Props>()
</script>

<template>
  <section class="flex flex-col gap-3">
    <!-- Title & Description -->
    <div class="flex flex-col gap-1">
      <h1 class="heading-s text-slate-950">{{ programInfo.title }}</h1>
      <p class="body-caption text-slate-600">{{ programInfo.description }}</p>
    </div>

    <!-- Stats Card -->
    <div class="bg-primary-50 flex flex-col gap-3 rounded-sm p-3">
      <div v-for="stat in stats" :key="stat.id" class="flex flex-col gap-1">
        <span class="body-caption-medium text-slate-800">{{ stat.label }}</span>
        <div class="flex items-center gap-1.5">
          <component :is="stat.icon" class="text-primary-600 size-4 shrink-0" />
          <span class="body-m-medium text-slate-950">{{ stat.value }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
