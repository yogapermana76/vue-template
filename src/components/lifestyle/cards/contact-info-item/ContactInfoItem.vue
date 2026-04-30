<script setup lang="ts">
  import { ChevronRight } from 'lucide-vue-next'
  import { Item, ItemContent, ItemTitle, ItemDescription, ItemActions } from '@/components/ui/item'

  export interface ContactInfoItemProps {
    name: string
    email?: string
    phone?: string
    clickable?: boolean
  }

  withDefaults(defineProps<ContactInfoItemProps>(), {
    clickable: false,
  })

  defineEmits<{
    click: []
  }>()
</script>

<template>
  <Item
    :class="[
      'box-border flex min-h-15.5 w-full items-center gap-2 rounded-sm border border-neutral-200 bg-white p-3',
      clickable
        ? 'cursor-pointer transition-all hover:bg-neutral-50 active:scale-[0.98] active:opacity-80'
        : '',
    ]"
    @click="clickable ? $emit('click') : undefined"
  >
    <!-- Konten utama: nama, email, dan nomor telepon -->
    <ItemContent class="flex min-h-9.5 flex-1 flex-col justify-center gap-0 p-0">
      <ItemTitle class="body-m-semibold min-h-5 wrap-break-word text-neutral-900">
        {{ name }}
      </ItemTitle>

      <!-- Info kontak dengan separator dot -->
      <ItemDescription
        v-if="email && phone"
        class="flex min-h-4.5 flex-wrap items-center gap-1 text-left"
      >
        <span class="body-caption break-all text-neutral-600">{{ email }}</span>
        <span class="h-1 w-1 shrink-0 rounded-full bg-neutral-300"></span>
        <span class="body-caption break-all text-neutral-600">{{ phone }}</span>
      </ItemDescription>
    </ItemContent>

    <!-- Chevron hanya muncul kalau clickable, selalu di kanan -->
    <ItemActions v-if="clickable" class="flex shrink-0 items-center justify-center">
      <ChevronRight class="size-4 text-neutral-900" />
    </ItemActions>
  </Item>
</template>
