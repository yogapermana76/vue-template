<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { Item, ItemContent } from '@/components/ui/item'
  import { ChevronRight } from 'lucide-vue-next'
  import { cn } from '@/utils/cn'

  export interface RecipientInfoCardProps {
    /** Recipient name */
    name: string
    /** Recipient email */
    email: string
    /** Recipient phone */
    phone: string
    /** Additional CSS classes */
    class?: HTMLAttributes['class']
  }

  const props = defineProps<RecipientInfoCardProps>()
  const emit = defineEmits<{
    click: []
  }>()

  const handleClick = () => {
    emit('click')
  }
</script>

<template>
  <Item
    as="button"
    variant="outline"
    :class="
      cn(
        'w-full cursor-pointer gap-2 rounded-lg border-neutral-200 bg-white p-3',
        'hover:bg-neutral-50',
        'focus-visible:border-primary-600 focus-visible:ring-primary-600/20',
        props.class,
      )
    "
    @click="handleClick"
  >
    <ItemContent class="min-w-0 items-start gap-0.5">
      <h3 class="body-m-semibold w-full text-left text-slate-950">{{ name }}</h3>
      <div class="body-caption flex flex-wrap items-center gap-1 text-slate-800/75">
        <span class="truncate">{{ email }}</span>
        <span class="size-1 shrink-0 rounded-full bg-slate-200" />
        <span class="shrink-0">{{ phone }}</span>
      </div>
    </ItemContent>

    <ChevronRight class="size-4 shrink-0 self-center text-slate-950" />
  </Item>
</template>
