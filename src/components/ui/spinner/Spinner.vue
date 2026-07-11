<script setup lang="ts">
  import { computed } from 'vue'
  import { Loader2 } from 'lucide-vue-next'

  const props = withDefaults(
    defineProps<{
      size?: 'xs' | 'sm' | 'md' | 'lg'
      /** Tone controls color. `inherit` uses currentColor (default). `primary` uses primary-600, `white` for dark bg. */
      tone?: 'inherit' | 'primary' | 'white' | 'muted'
      label?: string
    }>(),
    { size: 'md', tone: 'inherit' },
  )

  const sizeClass = computed(
    () =>
      ({
        xs: 'size-3.5',
        sm: 'size-4',
        md: 'size-5',
        lg: 'size-6',
      })[props.size],
  )

  const toneClass = computed(
    () =>
      ({
        inherit: '',
        primary: 'text-primary-600',
        white: 'text-white',
        muted: 'text-neutral-400',
      })[props.tone],
  )
</script>

<template>
  <span
    role="status"
    :aria-label="label ?? 'Memuat'"
    class="inline-flex items-center gap-2"
    :class="toneClass"
  >
    <Loader2 :class="[sizeClass, 'animate-spin']" />
    <span v-if="label" class="body-caption font-medium">{{ label }}</span>
  </span>
</template>
