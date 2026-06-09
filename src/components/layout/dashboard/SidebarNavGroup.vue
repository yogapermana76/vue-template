<script setup lang="ts">
  interface Props {
    /** Group label */
    label?: string
    /** Whether sidebar is collapsed */
    collapsed?: boolean
  }

  withDefaults(defineProps<Props>(), {
    collapsed: false,
  })
</script>

<template>
  <div class="space-y-1">
    <!-- Group Label (hidden when collapsed) - styled for gradient sidebar -->
    <p
      v-if="label && !collapsed"
      class="mb-2 px-3 text-xs font-medium tracking-wider text-white/40 uppercase"
    >
      {{ label }}
    </p>

    <!-- Divider when collapsed -->
    <div v-else-if="label && collapsed" class="mx-2 my-2 h-px bg-white/10" />

    <!-- Nav Items -->
    <slot :collapsed="collapsed" />
  </div>
</template>
