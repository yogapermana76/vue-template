<script setup lang="ts">
  import type { Component, HTMLAttributes } from 'vue'
  import { BottomSheet } from '@/components/ui/bottom-sheet'
  import { Button } from '@/components/ui/button'
  import { cn } from '@/utils/cn'

  export interface ButtonConfig {
    /** Button label text */
    label: string
    /** Button variant */
    variant?: 'primary' | 'secondary' | 'tertiary'
    /** Button size */
    size?: 'xs' | 'sm' | 'md' | 'lg'
    /** Click handler */
    onClick: () => void
  }

  export interface ConfirmationBottomSheetProps {
    /** Whether the bottom sheet is open */
    open?: boolean
    /** Illustration image (SVG component or URL) */
    image?: Component | string
    /** Title text */
    title: string
    /** Description text */
    description?: string
    /** Button configuration (1 or 2 buttons) */
    buttons?: ButtonConfig[]
    /** Button layout: 'row' (side by side) or 'column' (stacked) */
    buttonLayout?: 'row' | 'column'
    /** Allow dismissing by backdrop click or escape key */
    dismissible?: boolean
    /** Additional CSS classes */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<ConfirmationBottomSheetProps>(), {
    open: false,
    image: undefined,
    description: undefined,
    buttons: () => [],
    buttonLayout: 'row',
    dismissible: true,
  })

  const emit = defineEmits<{
    'update:open': [value: boolean]
  }>()
</script>

<template>
  <BottomSheet
    :open="open"
    :dismissible="dismissible"
    :show-close="false"
    has-footer
    footer-position="sticky"
    :class="cn('', props.class)"
    @update:open="emit('update:open', $event)"
  >
    <!-- Content: Image, Title, Description -->
    <div class="flex flex-col items-center gap-3 px-4 pt-0.5 pb-4">
      <!-- Image -->
      <div v-if="image" class="h-56 w-56 shrink-0">
        <component :is="image" v-if="typeof image !== 'string'" class="h-full w-full" />
        <img v-else :src="image" alt="" class="h-full w-full object-contain" />
      </div>

      <!-- Text -->
      <div class="flex w-full flex-col items-center gap-2 text-center">
        <h3 class="heading-s w-full text-slate-950">{{ title }}</h3>
        <p v-if="description" class="body-m w-full text-slate-800">
          {{ description }}
        </p>
      </div>
    </div>

    <!-- Footer: Buttons -->
    <template #footer>
      <div
        :class="cn('flex w-full', buttonLayout === 'column' ? 'flex-col gap-2' : 'flex-row gap-2')"
      >
        <Button
          v-for="(button, index) in buttons"
          :key="index"
          :variant="button.variant || 'primary'"
          :size="button.size || 'sm'"
          :class="buttonLayout === 'row' ? 'flex-1' : 'w-full'"
          @click="button.onClick"
        >
          {{ button.label }}
        </Button>
      </div>
    </template>
  </BottomSheet>
</template>
