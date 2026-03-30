<script lang="ts" setup>
  import { computed } from 'vue'
  import { X } from 'lucide-vue-next'
  import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
  } from '@/components/ui/drawer'

  interface Props {
    /** Is the bottom sheet open */
    open?: boolean
    /** Title of the bottom sheet */
    title?: string
    /** Description of the bottom sheet */
    description?: string
    /** Show close button */
    showClose?: boolean
    /** Custom class for content */
    contentClass?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    open: false,
    showClose: true,
    contentClass: '',
  })

  const emit = defineEmits<{
    'update:open': [value: boolean]
  }>()

  const isOpen = computed({
    get: () => props.open,
    set: value => emit('update:open', value),
  })
</script>

<template>
  <Drawer v-model:open="isOpen" direction="bottom">
    <slot name="trigger" />

    <DrawerContent :class="contentClass">
      <!-- Header (optional) -->
      <template v-if="title || description || showClose">
        <DrawerHeader class="flex items-start justify-between">
          <div class="text-left">
            <DrawerTitle v-if="title">{{ title }}</DrawerTitle>
            <DrawerDescription v-if="description">
              {{ description }}
            </DrawerDescription>
          </div>
          <DrawerClose v-if="showClose" as-child>
            <button class="hover:bg-accent rounded-lg p-1">
              <X class="size-5" />
            </button>
          </DrawerClose>
        </DrawerHeader>
      </template>

      <!-- Flexible content slot -->
      <div class="px-4 pb-6">
        <slot />
      </div>
    </DrawerContent>
  </Drawer>
</template>
