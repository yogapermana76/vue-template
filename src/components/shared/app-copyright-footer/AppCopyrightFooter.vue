<script setup lang="ts">
  withDefaults(
    defineProps<{
      owner?: string
    }>(),
    { owner: 'PT PLN (Persero)' },
  )

  const year = new Date().getFullYear()
</script>

<template>
  <footer>
    <p class="body-caption text-center text-slate-500">
      &copy; {{ year }} {{ owner }}. All rights reserved.
    </p>
  </footer>
</template>
