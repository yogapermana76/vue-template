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

  type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

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

  // Size classes mapping
  const sizeClasses: Record<DialogSize, string> = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    full: 'sm:max-w-full sm:w-[calc(100%-2rem)]',
  }

  // Header classes
  const headerClasses = computed(() => {
    return cn(
      'flex flex-row items-center justify-between gap-3 px-4 py-2',
      props.headerShowBorder && 'border-b',
      props.headerClass,
    )
  })

  // Body classes
  const bodyClasses = computed(() => {
    return cn('p-4', props.bodyClass)
  })

  // Footer classes
  const footerClasses = computed(() => {
    return cn('p-4 justify-end', props.footerShowBorder && 'border-t', props.footerClass)
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
    <DialogContent
      :class="cn(sizeClasses[size], contentClass)"
      :show-close-button="false"
      class="gap-0 p-0"
      @interact-outside="handleInteractOutside"
    >
      <!-- Dialog Header -->
      <DialogHeader :class="headerClasses">
        <!-- Back Button -->
        <Button
          v-if="showBackButton"
          variant="tertiary"
          size="xs"
          layout="iconOnly"
          class="-ml-2 size-8 shrink-0"
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
          variant="tertiary"
          size="xs"
          layout="iconOnly"
          class="-mr-2 size-8 shrink-0"
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
