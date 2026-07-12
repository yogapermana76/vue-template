<script setup lang="ts">
  import { computed } from 'vue'
  import { formatAmountCell } from '../../utils/cellFormatters'

  const props = defineProps<{ value?: unknown }>()
  const formatted = computed(() => formatAmountCell(props.value))
</script>

<template>
  <span class="body-m-semibold text-neutral-950 tabular-nums">{{ formatted }}</span>
</template>
