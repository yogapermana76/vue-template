<script setup lang="ts">
  import { computed } from 'vue'
  import { X } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { cn } from '@/utils/cn'

  /**
   * Reusable header for sheets / dialogs.
   *
   * Variants:
   * - plain:   flat white background, thin border-bottom.
   * - tinted:  subtle primary-50 wash — the default for "form" contexts (Add / Edit).
   * - hero:    full gradient primary-50 → background with room for an avatar / badges (Detail sheets).
   *
   * The component only handles the surface + close button; content is via slots so
   * consumers stay in control of composition (avatar, badges, meta, etc).
   */

  type Variant = 'plain' | 'tinted' | 'hero'

  interface Props {
    variant?: Variant
    title?: string
    description?: string
    showClose?: boolean
    closeLabel?: string
    class?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'tinted',
    showClose: true,
    closeLabel: 'Close',
  })

  defineEmits<{
    close: []
  }>()

  const surfaceClass: Record<Variant, string> = {
    plain: 'bg-background',
    tinted: 'bg-primary-50/60',
    hero: 'bg-linear-to-b from-primary-50 to-background',
  }

  const paddingClass: Record<Variant, string> = {
    plain: 'px-6 py-4',
    tinted: 'px-6 py-4',
    hero: 'px-6 py-5',
  }

  const rootClass = computed(() =>
    cn(
      'relative shrink-0 border-b border-neutral-200',
      surfaceClass[props.variant],
      paddingClass[props.variant],
      props.class,
    ),
  )
</script>

<template>
  <div :class="rootClass" data-slot="sheet-header">
    <Button
      v-if="showClose"
      variant="secondary"
      size="xs"
      layout="iconOnly"
      class="absolute top-3 right-3 shrink-0"
      :aria-label="closeLabel"
      @click="$emit('close')"
    >
      <X class="size-4" />
    </Button>

    <!-- Content slot (avatar + title + badges for hero, or plain title + subtitle) -->
    <slot>
      <div class="pr-8">
        <h2 v-if="title" class="heading-s text-foreground truncate">{{ title }}</h2>
        <p v-if="description" class="body-caption text-muted-foreground mt-1 truncate">
          {{ description }}
        </p>
      </div>
    </slot>
  </div>
</template>
