<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { CircleHelp, ChevronRight } from 'lucide-vue-next'
  import { cn } from '@/utils/cn'
  import { Item, ItemContent, ItemTitle, ItemActions } from '@/components/ui/item'

  export interface Props {
    question: string
    to?: string
    class?: HTMLAttributes['class']
  }

  const props = defineProps<Props>()
</script>

<template>
  <Item
    :as="to ? 'a' : 'div'"
    :href="to"
    data-slot="faq-item"
    variant="outline"
    :class="cn('cursor-pointer gap-2.5 rounded-sm border-slate-200 bg-white p-3', props.class)"
  >
    <CircleHelp class="size-5 shrink-0 text-slate-400" />
    <ItemContent>
      <ItemTitle class="body-m-medium whitespace-normal text-slate-700">
        {{ question }}
      </ItemTitle>
    </ItemContent>
    <ItemActions>
      <ChevronRight class="size-5 shrink-0 text-slate-400" />
    </ItemActions>
  </Item>
</template>
