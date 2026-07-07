<script lang="ts" setup>
  import { computed } from 'vue'
  import { Drawer, DrawerContent } from '@/components/ui/drawer'
  import { cn } from '@/utils/cn'
  import SheetHeader from './SheetHeader.vue'

  type FooterPosition = 'sticky' | 'static'
  type SheetWidth = 'sm' | 'md' | 'lg' | 'xl'
  type HeaderVariant = 'plain' | 'tinted' | 'hero'

  interface Props {
    /** Whether the sheet is open */
    open?: boolean
    /** Allow dismissing by backdrop click or escape key */
    dismissible?: boolean
    /** Title of the sheet (rendered by built-in header) */
    title?: string
    /** Description text below the title */
    description?: string
    /** Show close button in header */
    showClose?: boolean
    /** Header visual variant */
    headerVariant?: HeaderVariant
    /** Skip built-in header (consumer renders own via #header slot or DetailSheet band) */
    hideHeader?: boolean
    /** Width preset */
    width?: SheetWidth
    /** Class overrides */
    contentClass?: string
    contentSlotClass?: string
    headerClass?: string
    /** Footer configuration */
    hasFooter?: boolean
    footerPosition?: FooterPosition
    footerClass?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    open: false,
    dismissible: true,
    title: undefined,
    description: undefined,
    showClose: true,
    headerVariant: 'tinted',
    hideHeader: false,
    width: 'md',
    contentClass: '',
    contentSlotClass: '',
    headerClass: '',
    hasFooter: false,
    footerPosition: 'sticky',
    footerClass: '',
  })

  const emit = defineEmits<{
    'update:open': [value: boolean]
  }>()

  const isOpen = computed({
    get: () => props.open,
    set: value => emit('update:open', value),
  })

  // Widths mirror prototype (.drawer 680px; .drawer.wide 960px)
  const widthClasses: Record<SheetWidth, string> = {
    sm: 'sm:!max-w-md',
    md: 'sm:!max-w-xl',
    lg: 'sm:!max-w-2xl',
    xl: 'sm:!max-w-4xl',
  }

  const contentClasses = computed(() =>
    cn('flex h-full flex-col bg-slate-50', widthClasses[props.width], props.contentClass),
  )

  const bodyClasses = computed(() =>
    cn('min-h-0 flex-1 overflow-y-auto px-6 py-5', props.contentSlotClass),
  )

  const footerClasses = computed(() => {
    const position = props.footerPosition === 'sticky' ? 'sticky bottom-0' : ''
    return cn(
      'shrink-0 flex w-full items-center justify-end gap-2.5 border-t border-neutral-200 bg-primary-50/60 px-6 py-3.5',
      position,
      props.footerClass,
    )
  })

  const hasHeader = computed(
    () => !props.hideHeader && (props.title || props.description || props.showClose),
  )

  const closeSheet = () => (isOpen.value = false)
</script>

<template>
  <Drawer v-model:open="isOpen" direction="right" :dismissible="dismissible">
    <slot name="trigger" />

    <DrawerContent :class="contentClasses" :show-drag-handle="false">
      <!-- Built-in header (opt-out via hideHeader for DetailSheet's custom band) -->
      <SheetHeader
        v-if="hasHeader"
        :variant="headerVariant"
        :title="title"
        :description="description"
        :show-close="showClose"
        :class="headerClass"
        @close="closeSheet"
      >
        <slot name="header" />
      </SheetHeader>

      <!-- Custom header slot (rendered when hideHeader=true) -->
      <slot v-else name="header" />

      <div :class="bodyClasses">
        <slot />
      </div>

      <div v-if="hasFooter || $slots.footer" :class="footerClasses">
        <slot name="footer" />
      </div>
    </DrawerContent>
  </Drawer>
</template>
