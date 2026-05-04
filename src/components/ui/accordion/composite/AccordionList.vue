<script setup lang="ts">
  import type { Component, HTMLAttributes } from 'vue'
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from '@/components/ui/accordion'

  interface AccordionListItem {
    id: string
    title: string
    content: string | Component // text, HTML, or component
    disabled?: boolean
    itemClass?: HTMLAttributes['class']
    triggerClass?: HTMLAttributes['class']
    contentClass?: HTMLAttributes['class']
  }

  interface Props {
    items: AccordionListItem[]
    type?: 'single' | 'multiple'
    collapsible?: boolean
    defaultValue?: string | string[]
    class?: HTMLAttributes['class']
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'single',
    collapsible: true,
    defaultValue: undefined,
    ariaLabel: 'Accordion menu',
    class: 'gap-3',
  })

  const emit = defineEmits<{
    change: [value: string | string[] | undefined]
  }>()

  const handleValueChange = (value: string | string[] | undefined) => {
    emit('change', value)
  }

  const isStringContent = (content: string | Component): content is string => {
    return typeof content === 'string'
  }

  const isItemDisabled = (item: AccordionListItem): boolean => {
    return item.disabled ?? false
  }

  // Default styles for accordion items
  const getItemClass = (item: AccordionListItem): string => {
    const defaultClass = 'border-0'
    return item.itemClass ? `${defaultClass} ${item.itemClass}` : defaultClass
  }

  const getTriggerClass = (item: AccordionListItem): string => {
    const defaultClass =
      'px-0 py-2 border-b border-transparent hover:bg-neutral-50 hover:border-transparent data-[state=open]:border-transparent transition-colors rounded-none'
    return item.triggerClass ? `${defaultClass} ${item.triggerClass}` : defaultClass
  }

  const getContentClass = (item: AccordionListItem): string => {
    const defaultClass = 'pb-4 px-0 body-caption text-slate-700'
    return item.contentClass ? `${defaultClass} ${item.contentClass}` : defaultClass
  }
</script>

<template>
  <Accordion
    :type="props.type"
    :collapsible="props.collapsible"
    :default-value="props.defaultValue"
    :class="`${props.class} *:border-0`"
    :aria-label="props.ariaLabel"
    @update:model-value="handleValueChange"
  >
    <AccordionItem
      v-for="item in items"
      :key="item.id"
      :value="item.id"
      :class="getItemClass(item)"
      :disabled="isItemDisabled(item)"
    >
      <AccordionTrigger :class="getTriggerClass(item)">
        {{ item.title }}
      </AccordionTrigger>

      <AccordionContent :class="getContentClass(item)">
        <slot :name="`content-${item.id}`" :item="item">
          <template v-if="isStringContent(item.content)">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="html-content" v-html="item.content" />
          </template>
          <component v-else :is="item.content" :item="item" />
        </slot>
      </AccordionContent>
    </AccordionItem>

    <slot />
  </Accordion>
</template>
