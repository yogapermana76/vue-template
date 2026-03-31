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
    modelValue?: string | string[] | undefined
    defaultValue?: string | string[]
    class?: HTMLAttributes['class']
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'single',
    collapsible: true,
    defaultValue: undefined,
    ariaLabel: 'Accordion menu',
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string | string[] | undefined]
    change: [value: string | string[] | undefined]
  }>()

  const isControlled = () => 'modelValue' in props

  const getCurrentValue = () => {
    return isControlled() ? props.modelValue : props.defaultValue
  }

  // Emit both events for backward compatibility
  const handleValueChange = (value: string | string[] | undefined) => {
    emit('update:modelValue', value)
    emit('change', value)
  }

  const isStringContent = (content: string | Component): content is string => {
    return typeof content === 'string'
  }

  const isItemDisabled = (item: AccordionListItem): boolean => {
    return item.disabled ?? false
  }
</script>

<template>
  <Accordion
    :type="props.type"
    :collapsible="props.collapsible"
    :default-value="getCurrentValue()"
    :model-value="isControlled() ? props.modelValue : undefined"
    :class="props.class"
    :aria-label="props.ariaLabel"
    @update:model-value="handleValueChange"
  >
    <AccordionItem
      v-for="item in items"
      :key="item.id"
      :value="item.id"
      :class="item.itemClass"
      :disabled="isItemDisabled(item)"
    >
      <AccordionTrigger :class="item.triggerClass">
        {{ item.title }}
      </AccordionTrigger>

      <AccordionContent :class="item.contentClass">
        <slot :name="`content-${item.id}`" :item="item">
          <template v-if="isStringContent(item.content)">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="item.content" />
          </template>
          <component v-else :is="item.content" :item="item" />
        </slot>
      </AccordionContent>
    </AccordionItem>

    <slot />
  </Accordion>
</template>
