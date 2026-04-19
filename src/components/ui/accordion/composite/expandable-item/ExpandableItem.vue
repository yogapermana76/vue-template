<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { CircleHelp, ChevronRight } from 'lucide-vue-next'
  import { cn } from '@/utils/cn'
  import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
  } from '@/components/ui/accordion'

  export interface Props {
    question: string
    answer: string
    value?: string
    class?: HTMLAttributes['class']
  }

  const props = defineProps<Props>()
</script>

<template>
  <Accordion type="single" collapsible :class="cn('w-full', props.class)">
    <AccordionItem
      :value="value || question"
      class="flex flex-col gap-2.5 rounded-2xl border! border-slate-300 bg-white p-3"
    >
      <AccordionTrigger
        class="flex w-full items-center gap-3 p-0 hover:no-underline [&>svg]:rotate-0! [&[data-state=open]>svg:last-child]:rotate-90!"
      >
        <CircleHelp class="size-5 shrink-0 text-slate-500" />
        <span class="body-m-medium flex-1 text-left text-slate-900">
          {{ question }}
        </span>
        <template #icon>
          <ChevronRight class="size-4 shrink-0 text-teal-600 transition-transform duration-200" />
        </template>
      </AccordionTrigger>
      <AccordionContent class="pr-0 pl-0">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="body-caption text-slate-700" v-html="answer" />
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
