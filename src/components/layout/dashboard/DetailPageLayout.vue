<script setup lang="ts">
  import { ArrowLeft } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { Card } from '@/components/ui/card'
  import { EmptyState } from '@/components/ui/empty-state'

  /**
   * Shared shell for admin detail pages. Structure: not-found empty state
   * OR `header | main [+ aside sticky at lg+] | modals`. Aside is optional
   * — omitting the slot collapses to a single column.
   */
  interface Props {
    notFound?: boolean
    notFoundTitle?: string
    notFoundDescription?: string
    notFoundBackLabel?: string
    /** Aside column width in px at lg+. */
    asideWidth?: number
    /** Vertical gap between main + aside (Tailwind scale). */
    gap?: 3 | 4 | 5 | 6
  }

  withDefaults(defineProps<Props>(), {
    notFound: false,
    notFoundTitle: 'Not found',
    notFoundDescription: 'The item you are looking for does not exist or has been removed.',
    notFoundBackLabel: 'Go back',
    asideWidth: 360,
    gap: 5,
  })

  defineEmits<{ back: [] }>()

  defineSlots<{
    header(): unknown
    main(): unknown
    aside(): unknown
    modals(): unknown
  }>()
</script>

<template>
  <!-- Not-found empty state — replaces the whole page. -->
  <Card v-if="notFound" class="p-6">
    <EmptyState :title="notFoundTitle" :description="notFoundDescription">
      <template #actions>
        <Button variant="primary" @click="$emit('back')">
          <ArrowLeft class="size-4" />
          {{ notFoundBackLabel }}
        </Button>
      </template>
    </EmptyState>
  </Card>

  <template v-else>
    <slot name="header" />

    <div class="detail-grid grid grid-cols-1 items-start" :class="`gap-${gap}`">
      <div class="flex flex-col gap-5" style="min-width: 0">
        <slot name="main" />
      </div>
      <aside v-if="$slots.aside" class="flex flex-col gap-5 lg:sticky lg:top-4">
        <slot name="aside" />
      </aside>
    </div>

    <slot name="modals" />
  </template>
</template>

<style scoped>
  /* Two-column layout at lg+. Aside width is prop-driven so pages can tune it. */
  @media (min-width: 1024px) {
    .detail-grid {
      grid-template-columns: 1fr v-bind('`${asideWidth}px`');
    }
  }
</style>
