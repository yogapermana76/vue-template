<script setup lang="ts">
  import { InformationBottomSheet } from '@/components/shared'

  interface TncItem {
    order: number
    title: string
    value: string
  }

  defineProps<{
    open: boolean
    isTncLoading: boolean
    tncItems: TncItem[]
  }>()

  const emit = defineEmits<{
    'update:open': [value: boolean]
  }>()
</script>

<template>
  <InformationBottomSheet :open="open" title="Informasi" @update:open="emit('update:open', $event)">
    <div class="flex flex-col">
      <!-- Loading State -->
      <div v-if="isTncLoading" class="flex flex-col gap-3">
        <div class="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
        <div class="h-4 w-full animate-pulse rounded bg-slate-200" />
        <div class="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
      </div>

      <!-- Terms and Conditions Items -->
      <div v-else class="flex flex-col gap-4">
        <div v-for="item in tncItems" :key="item.order" class="flex flex-col gap-2">
          <h3 class="body-m-semibold text-neutral-90">{{ item.title }}</h3>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="html-content body-caption text-neutral-80" v-html="item.value" />
        </div>
      </div>
    </div>
  </InformationBottomSheet>
</template>
