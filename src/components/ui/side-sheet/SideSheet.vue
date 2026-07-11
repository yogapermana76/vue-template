<script lang="ts" setup>
  import { computed } from 'vue'
  import { Drawer, DrawerContent } from '@/components/ui/drawer'
  import { cn } from '@/utils/cn'
  import SideSheetHeader from './SideSheetHeader.vue'
  import type { SheetWidth, SideSheetProps } from './types'

  const props = withDefaults(defineProps<SideSheetProps>(), {
    direction: 'right',
    open: false,
    dismissible: true,
    title: undefined,
    description: undefined,
    showClose: true,
    showBack: false,
    headerVariant: 'tinted',
    hideHeader: false,
    width: 'md',
    contentClass: '',
    contentSlotClass: '',
    headerClass: '',
    hasFooter: false,
    footerPosition: 'sticky',
    footerClass: '',
    nested: false,
  })

  const emit = defineEmits<{
    'update:open': [value: boolean]
    back: []
  }>()

  const isOpen = computed({
    get: () => props.open,
    set: value => emit('update:open', value),
  })

  const widthClasses: Record<SheetWidth, string> = {
    sm: 'sm:!max-w-md',
    md: 'sm:!max-w-xl',
    lg: 'sm:!max-w-2xl',
    xl: 'sm:!max-w-4xl',
  }

  // `!w-full` overrides DrawerContent's default `w-3/4` on mobile; `sm:` presets take over.
  const contentClasses = computed(() =>
    cn('flex h-full flex-col bg-slate-50 !w-full', widthClasses[props.width], props.contentClass),
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
    () =>
      !props.hideHeader && (props.title || props.description || props.showClose || props.showBack),
  )

  const closeSheet = () => (isOpen.value = false)
</script>

<template>
  <Drawer v-model:open="isOpen" :direction="direction" :dismissible="dismissible" :nested="nested">
    <slot name="trigger" />

    <DrawerContent :class="contentClasses" :show-drag-handle="false">
      <SideSheetHeader
        v-if="hasHeader"
        :variant="headerVariant"
        :title="title"
        :description="description"
        :show-close="showClose"
        :show-back="showBack"
        :class="headerClass"
        @close="closeSheet"
        @back="emit('back')"
      >
        <slot name="header" />
      </SideSheetHeader>

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
