<script setup lang="ts">
  import { AccordionList } from '@/components/ui/accordion'

  interface AccordionItem {
    id: string
    title: string
    content: string
  }

  interface Props {
    items: AccordionItem[]
  }

  defineProps<Props>()
</script>

<template>
  <section class="flex flex-col gap-4">
    <AccordionList :items="items" type="single" collapsible />
  </section>
</template>
