<script setup lang="ts">
  import { computed } from 'vue'
  import { AccordionList } from '@/components/ui/accordion'

  interface AccordionItem {
    id: string
    title: string
    content: string
  }

  interface Props {
    items: AccordionItem[]
  }

  const props = defineProps<Props>()

  const firstItemId = computed(() => props.items[0]?.id)
</script>

<template>
  <section class="flex flex-col gap-4">
    <AccordionList
      :key="firstItemId"
      :items="items"
      :default-value="firstItemId"
      type="single"
      collapsible
    />
  </section>
</template>
