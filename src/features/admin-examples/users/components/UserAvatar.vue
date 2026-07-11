<script setup lang="ts">
  import { computed } from 'vue'
  import { userInitials } from './userColumns'

  const props = withDefaults(
    defineProps<{
      name: string
      size?: 'sm' | 'md' | 'lg'
    }>(),
    { size: 'sm' },
  )

  const sizeClass = computed(
    () =>
      ({
        sm: 'size-9 body-caption-semibold',
        md: 'size-11 body-m-semibold',
        lg: 'size-14 heading-s',
      })[props.size],
  )

  const initials = computed(() => userInitials(props.name))
</script>

<template>
  <div
    :class="[
      'bg-primary-100 text-primary-700 flex shrink-0 items-center justify-center rounded-full',
      sizeClass,
    ]"
  >
    {{ initials }}
  </div>
</template>
