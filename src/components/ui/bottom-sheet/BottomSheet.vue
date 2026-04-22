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
  import { useSafeArea } from '@/composables/ui'

  // ============================================================================
  // Type Definitions & Constants
  // ============================================================================

  type FooterPosition = 'sticky' | 'static'

  // ============================================================================
  // Props Interface
  // ============================================================================

  interface Props {
    // State Props
    /** Whether the bottom sheet is open */
    open?: boolean
    /** Allow dismissing by backdrop click or escape key */
    dismissible?: boolean

    // Content Props
    /** Title of the bottom sheet */
    title?: string
    /** Description text (shown below title) */
    description?: string
    /** Show close button in top right */
    showClose?: boolean
    /** Custom CSS class for DrawerContent wrapper */
    contentClass?: string
    /** Custom CSS class for scrollable slot container */
    contentSlotClass?: string

    // Footer Props
    /** Show footer section */
    hasFooter?: boolean
    /** Footer positioning behavior
     * @param 'sticky' - fixed at bottom (default)
     * @param 'normal' - part of scrollable content
     */
    footerPosition?: FooterPosition
    /** Custom CSS class for footer */
    footerClass?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    open: false,
    dismissible: true,
    title: undefined,
    description: undefined,
    showClose: true,
    contentClass: '',
    contentSlotClass: '',
    hasFooter: false,
    footerPosition: 'sticky',
    footerClass: '',
  })

  // ============================================================================
  // Emits & Computed
  // ============================================================================

  const emit = defineEmits<{
    'update:open': [value: boolean]
  }>()

  const { safeAreaBottomStyle } = useSafeArea()

  const isOpen = computed({
    get: () => props.open,
    set: value => emit('update:open', value),
  })

  const footerClasses = computed(() => {
    const baseStyles = [props.footerClass, 'shrink-0 flex flex-col items-start gap-3 w-full']

    const variantStyles =
      props.footerPosition === 'sticky'
        ? 'py-3 px-4 border border-neutral-200 rounded-t-3xl sticky bottom-0 bg-background'
        : 'px-4 py-3 border-t border-neutral-200'

    return [...baseStyles, variantStyles]
  })
</script>

<template>
  <Drawer v-model:open="isOpen" direction="bottom" :dismissible="dismissible">
    <slot name="trigger" />

    <DrawerContent :class="contentClass" :show-drag-handle="!showClose" class="flex flex-col">
      <!-- Header (optional) -->
      <template v-if="title || description || showClose">
        <DrawerHeader class="shrink-0 flex-row gap-2! px-4 py-2">
          <div class="flex-1">
            <DrawerTitle v-if="title">{{ title }}</DrawerTitle>
            <DrawerDescription v-if="description">
              {{ description }}
            </DrawerDescription>
          </div>
          <DrawerClose v-if="showClose" as-child>
            <button class="-mr-1.5 shrink-0 rounded-full p-1 hover:bg-neutral-100">
              <X class="size-4 text-neutral-500" />
            </button>
          </DrawerClose>
        </DrawerHeader>
      </template>

      <!-- Flexible content slot (scrollable) -->
      <div
        :class="['scrollbar-none min-h-0 flex-1 overflow-y-auto px-4 pb-6', contentSlotClass]"
        :style="!hasFooter ? safeAreaBottomStyle : undefined"
      >
        <slot />
      </div>

      <!-- Footer (optional) -->
      <div v-if="hasFooter" :class="footerClasses" :style="safeAreaBottomStyle">
        <slot name="footer" />
      </div>
    </DrawerContent>
  </Drawer>
</template>
