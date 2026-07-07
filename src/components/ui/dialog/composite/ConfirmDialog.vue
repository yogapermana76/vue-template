<script lang="ts" setup>
  import type { Component, HTMLAttributes } from 'vue'
  import { computed } from 'vue'
  import { Button } from '@/components/ui/button'
  import { EmptyState } from '@/components/ui/empty-state'
  import { cn } from '@/utils/cn'
  import DialogWrapper from './DialogWrapper.vue'

  // ---------- Illustration defaults per variant ----------
  // Kept as static imports so bundler can code-split & hash them.
  import checkIllustration from '@/assets/illustrations/check.png'
  import disappointedIllustration from '@/assets/illustrations/disappointed-mascot.png'
  import mascotConfirmIllustration from '@/assets/illustrations/mascot-confirm.png'
  import pensiveIllustration from '@/assets/illustrations/pensive-mascot.png'

  export type ConfirmDialogVariant = 'primary' | 'info' | 'success' | 'warning' | 'danger'

  const variantIllustration: Record<ConfirmDialogVariant, string> = {
    primary: mascotConfirmIllustration,
    info: mascotConfirmIllustration,
    success: checkIllustration,
    warning: pensiveIllustration,
    danger: disappointedIllustration,
  }

  export interface ConfirmDialogButton {
    /** Button label text */
    label: string
    /** Button variant */
    variant?: 'primary' | 'secondary' | 'tertiary' | 'info' | 'success' | 'warning' | 'danger'
    /** Soft (muted) tone for the variant */
    soft?: boolean
    /** Button size */
    size?: 'xs' | 'sm' | 'md' | 'lg'
    /** Loading state */
    loading?: boolean
    /** Disabled state */
    disabled?: boolean
    /** Extra classes */
    class?: HTMLAttributes['class']
    /** Click handler */
    onClick: () => void
  }

  export interface ConfirmDialogProps {
    /** Whether the dialog is open */
    open?: boolean
    /**
     * Semantic variant. Drives the default illustration when `image` is not set.
     * - primary/info → mascot-confirm
     * - success      → check
     * - warning      → pensive-mascot
     * - danger       → disappointed-mascot
     */
    variant?: ConfirmDialogVariant
    /** Custom illustration (Component or URL). Overrides the variant default. */
    image?: Component | string
    /** Set to true to skip rendering any illustration */
    hideIllustration?: boolean
    /** EmptyState image size preset */
    imageSize?: 'sm' | 'md' | 'lg'
    /** Title text */
    title?: string
    /** Description text (rendered as plain text) */
    description?: string
    /** Button configuration (0, 1, or 2 buttons) */
    buttons?: ConfirmDialogButton[]
    /** Button layout: 'row' (side by side) or 'column' (stacked) */
    buttonLayout?: 'row' | 'column'
    /** Allow dismissing by backdrop click or escape key */
    dismissible?: boolean
    /** Hide the close (X) button in the header */
    hideClose?: boolean
    /** Dialog size */
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    /** Additional CSS classes on the dialog root */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<ConfirmDialogProps>(), {
    open: false,
    variant: 'primary',
    image: undefined,
    hideIllustration: false,
    imageSize: 'md',
    title: undefined,
    description: undefined,
    buttons: () => [],
    buttonLayout: 'row',
    dismissible: true,
    hideClose: false,
    size: 'sm',
  })

  const emit = defineEmits<{
    'update:open': [value: boolean]
  }>()

  const isOpen = computed({
    get: () => props.open,
    set: v => emit('update:open', v),
  })

  // Resolve which illustration to render.
  const resolvedImage = computed<Component | string | undefined>(() => {
    if (props.hideIllustration) return undefined
    if (props.image) return props.image
    return variantIllustration[props.variant]
  })

  const hasFooter = computed(() => props.buttons.length > 0)

  const footerClass = computed(() =>
    cn('flex w-full', props.buttonLayout === 'column' ? 'flex-col gap-2' : 'flex-row gap-2'),
  )

  const buttonClass = (button: ConfirmDialogButton) =>
    cn(props.buttonLayout === 'row' ? 'flex-1' : 'w-full', button.class)
</script>

<template>
  <DialogWrapper
    v-model:open="isOpen"
    :size="size"
    :show-close-button="!hideClose"
    :close-on-overlay-click="dismissible"
    :show-footer="hasFooter"
    :class="props.class"
    body-class="px-6 pt-2 pb-6"
    footer-class="px-6 pb-6 pt-0"
    header-class="px-6 pt-4 pb-1 border-0"
  >
    <EmptyState
      :image="resolvedImage"
      :image-size="imageSize"
      :title="title"
      :description="description"
    >
      <slot />
    </EmptyState>

    <template v-if="hasFooter" #footer>
      <div :class="footerClass">
        <Button
          v-for="(button, index) in buttons"
          :key="index"
          type="button"
          :variant="button.variant ?? 'primary'"
          :soft="button.soft"
          :size="button.size ?? 'md'"
          :loading="button.loading"
          :disabled="button.disabled || button.loading"
          :class="buttonClass(button)"
          @click="button.onClick"
        >
          {{ button.label }}
        </Button>
      </div>
    </template>
  </DialogWrapper>
</template>
