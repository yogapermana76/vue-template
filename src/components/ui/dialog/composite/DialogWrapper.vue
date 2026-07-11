<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { ArrowLeft, X } from 'lucide-vue-next'
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  import { cn } from '@/utils/cn'

  type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'

  const props = withDefaults(
    defineProps<{
      // Dialog Base Props
      open?: boolean
      modal?: boolean
      defaultOpen?: boolean
      closeOnOverlayClick?: boolean

      // Size & Layout
      size?: DialogSize
      contentClass?: string

      // Header Props
      title?: string
      showBackButton?: boolean
      showCloseButton?: boolean
      headerShowBorder?: boolean
      headerClass?: string

      // Body Props
      bodyClass?: string

      // Footer Props
      showFooter?: boolean
      footerShowBorder?: boolean
      footerClass?: string
    }>(),
    {
      size: 'lg',
      modal: true,
      closeOnOverlayClick: false,
      showBackButton: false,
      showCloseButton: true,
      headerShowBorder: false,
      showFooter: false,
      footerShowBorder: false,
    },
  )

  const emit = defineEmits<{
    'update:open': [value: boolean]
    back: []
  }>()

  const isOpen = ref(props.defaultOpen ?? false)

  const openValue = computed({
    get: () => props.open ?? isOpen.value,
    set: (value: boolean) => {
      isOpen.value = value
      emit('update:open', value)
    },
  })

  // Size classes mapping (Tailwind max-w tokens)
  // sm≈24rem, md≈28rem, lg≈32rem, xl≈36rem, 2xl≈42rem
  const sizeClasses: Record<DialogSize, string> = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
    full: 'sm:max-w-full sm:w-[calc(100%-2rem)]',
  }

  // Header classes — mirror prototype .dlg-h (bg-primary-50 tinted band, subtle border)
  const headerClasses = computed(() => {
    return cn(
      'flex flex-row items-center justify-between gap-3 border-b border-neutral-100 bg-primary-50/60 px-5 py-3.5',
      props.headerShowBorder === false && 'border-b-0',
      props.headerClass,
    )
  })

  // Body classes — `flex-1 min-h-0 overflow-y-auto` makes the body the scroll
  // container so the dialog header + footer stay pinned while long content scrolls.
  const bodyClasses = computed(() =>
    cn('flex-1 min-h-0 overflow-y-auto px-5 py-4', props.bodyClass),
  )

  // Footer classes — parchment-ish tint + divider top, right aligned
  const footerClasses = computed(() => {
    return cn(
      'justify-end gap-2.5 border-t border-neutral-100 bg-primary-50/60 px-5 py-3',
      props.footerShowBorder === false && 'border-t-0',
      props.footerClass,
    )
  })

  // Methods
  const show = () => {
    openValue.value = true
  }

  const hide = () => {
    openValue.value = false
  }

  const toggle = () => {
    openValue.value = !openValue.value
  }

  // Event handlers
  const handleBack = () => {
    emit('back')
  }

  const handleClose = () => {
    openValue.value = false
  }

  const handleInteractOutside = (event: Event) => {
    if (!props.closeOnOverlayClick) {
      event.preventDefault()
    }
  }

  defineExpose({
    show,
    hide,
    toggle,
  })
</script>

<template>
  <Dialog v-model:open="openValue" :modal="modal">
    <!-- `flex flex-col` overrides DialogContent's default `grid` layout so the
         body slot can `flex-1 min-h-0` and drive vertical scrolling when the
         content exceeds `max-h-[90vh]`. -->
    <DialogContent
      :class="cn('flex max-h-[90vh] flex-col gap-0 p-0', sizeClasses[size], contentClass)"
      :show-close-button="false"
      @interact-outside="handleInteractOutside"
    >
      <!-- Dialog Header -->
      <DialogHeader :class="headerClasses">
        <!-- Back Button -->
        <Button
          v-if="showBackButton"
          variant="secondary"
          size="xs"
          layout="iconOnly"
          class="shrink-0"
          @click="handleBack"
        >
          <ArrowLeft class="size-4" />
        </Button>

        <!-- Title -->
        <DialogTitle class="flex-1 text-left">
          {{ title }}
        </DialogTitle>

        <!-- Title Extra Slot -->
        <div v-if="$slots.titleExtra" class="shrink-0">
          <slot name="titleExtra" />
        </div>

        <!-- Header Actions Slot -->
        <div v-if="$slots.headerActions" class="flex shrink-0 items-center gap-2">
          <slot name="headerActions" />
        </div>

        <!-- Close Button -->
        <Button
          v-if="showCloseButton"
          variant="secondary"
          size="xs"
          layout="iconOnly"
          class="shrink-0"
          @click="handleClose"
        >
          <X class="size-4" />
        </Button>
      </DialogHeader>

      <!-- Dialog Body -->
      <div :class="bodyClasses">
        <slot />
      </div>

      <!-- Dialog Footer -->
      <DialogFooter v-if="showFooter || $slots.footer" :class="footerClasses">
        <slot name="footer" />
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
