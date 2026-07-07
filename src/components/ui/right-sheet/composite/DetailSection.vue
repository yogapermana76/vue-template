<script lang="ts" setup>
  interface Props {
    title?: string
    /** Grid columns for field-value pairs */
    columns?: 1 | 2
    /** Hide the bottom border (default false — mirrors prototype .sec:last-child) */
    hideDivider?: boolean
  }

  withDefaults(defineProps<Props>(), {
    columns: 2,
    hideDivider: false,
  })
</script>

<template>
  <section
    :class="[
      'flex flex-col gap-3.5 px-6 py-5',
      !hideDivider && 'border-b border-neutral-100 last:border-b-0',
    ]"
  >
    <!-- Section header with inline extending divider (prototype .sec .st + ::after) -->
    <div v-if="title || $slots.title || $slots.action" class="flex items-center gap-3">
      <div class="flex flex-1 items-center gap-3">
        <slot name="title">
          <h3
            v-if="title"
            class="body-caption-semibold text-primary-700 shrink-0 tracking-widest uppercase"
          >
            {{ title }}
          </h3>
        </slot>
        <div class="h-px flex-1 bg-neutral-100" />
      </div>
      <div v-if="$slots.action" class="shrink-0">
        <slot name="action" />
      </div>
    </div>

    <div
      :class="[
        'grid gap-x-6.5 gap-y-3.5',
        columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1',
      ]"
    >
      <slot />
    </div>
  </section>
</template>
