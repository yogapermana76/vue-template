<script lang="ts" setup>
  import { computed } from 'vue'
  import { SectionHeader } from '@/components/shared'

  interface Props {
    title?: string
    /** Grid columns for field-value pairs */
    columns?: 1 | 2
    /** Hide the bottom border (default false — mirrors prototype .sec:last-child) */
    hideDivider?: boolean
    /**
     * Visual variant:
     *  - `default`: transparent bg, bottom border between sections.
     *  - `emphasized`: soft info-tinted card with border on all sides;
     *    use for the primary section (e.g. subject of the detail).
     */
    variant?: 'default' | 'emphasized'
  }

  const props = withDefaults(defineProps<Props>(), {
    columns: 2,
    hideDivider: false,
    variant: 'default',
  })

  const sectionClass = computed(() => {
    if (props.variant === 'emphasized') {
      // Emphasized: self-contained card. `mt-5` = same vertical rhythm as a
      // `default` section's `py-5` so it doesn't hug the sheet header when
      // it's the first child of a `p-0` sheet body.
      return 'bg-info-50 border-info-100 rounded-md border mx-6 mt-5 px-4 py-4'
    }
    return ['px-6 py-5', !props.hideDivider && 'border-b border-neutral-100 last:border-b-0']
  })
</script>

<template>
  <section :class="['flex flex-col gap-3.5', sectionClass]">
    <!-- Section header: shared `SectionHeader` handles the uppercase-tracked
         title + trailing divider line. `#action` forwards to `#trailing`. -->
    <SectionHeader v-if="title || $slots.action" :title="title ?? ''">
      <template v-if="$slots.action" #trailing>
        <slot name="action" />
      </template>
    </SectionHeader>

    <div
      :class="[
        'grid gap-x-6.5 gap-y-3.5',
        columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1',
      ]"
    >
      <slot />
    </div>

    <!-- Optional trailing footer inside the section (e.g. "Lihat lebih banyak"). -->
    <div v-if="$slots.footer">
      <slot name="footer" />
    </div>
  </section>
</template>
