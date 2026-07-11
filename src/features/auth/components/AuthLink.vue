<script setup lang="ts">
  import { RouterLink } from 'vue-router'

  defineProps<{
    to: string
  }>()
</script>

<template>
  <RouterLink
    :to="to"
    class="text-primary-700 hover:text-primary-800 body-caption-semibold underline-offset-2 hover:underline"
  >
    <slot />
  </RouterLink>
</template>
