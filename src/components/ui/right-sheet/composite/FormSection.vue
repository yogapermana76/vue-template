<script lang="ts" setup>
  interface Props {
    title?: string
    description?: string
    columns?: 1 | 2
    /** Hide the bottom border (prototype .form .sec:last-child) */
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
    <!-- Section header — uppercase primary label with extending divider line -->
    <div v-if="title || description || $slots.title" class="flex flex-col gap-1">
      <div class="flex items-center gap-3">
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
      <p v-if="description" class="body-caption text-muted-foreground">
        {{ description }}
      </p>
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
