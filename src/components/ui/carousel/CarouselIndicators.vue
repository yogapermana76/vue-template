<script setup lang="ts">
  // Dot indicators - show total slides and current position
  interface Props {
    /** Total snap points (usually slide count) */
    total: number
    /** Currently selected index (0-based) */
    selected: number
    /** Custom position class (default: bottom-4) */
    positionClass?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    positionClass: 'bottom-4',
  })

  const emit = defineEmits<{
    'dot-click': [index: number]
  }>()
</script>

<template>
  <!-- Indicator dots at bottom center -->
  <div
    :class="[
      'absolute left-1/2 flex -translate-x-1/2 items-center justify-center gap-2',
      props.positionClass,
    ]"
  >
    <!-- Active dot: w-8, full opacity; Inactive: w-2, 30% opacity -->
    <button
      v-for="(_, index) in Array(total)"
      :key="index"
      :class="[
        'h-2 rounded-full transition-all',
        selected === index ? 'bg-primary w-8' : 'bg-muted-foreground/30 w-2',
      ]"
      @click="emit('dot-click', index)"
      :aria-label="`Go to slide ${index + 1} of ${total}`"
      :aria-current="selected === index ? 'true' : 'false'"
    />
  </div>
</template>
