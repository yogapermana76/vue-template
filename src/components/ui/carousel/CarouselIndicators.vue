<script setup lang="ts">
  // Dot indicators - show total slides and current position
  interface Props {
    /** Total snap points (usually slide count) */
    total: number
    /** Currently selected index (0-based) */
    selected: number
    /** Custom position class (default: bottom-4) */
    positionClass?: string
    /** Custom indicator class for dots styling */
    indicatorClass?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    positionClass: 'absolute bottom-4',
    indicatorClass: '',
  })

  const emit = defineEmits<{
    'dot-click': [index: number]
  }>()
</script>

<template>
  <!-- Indicator dots at bottom center -->
  <div
    :class="[
      'left-1/2 flex -translate-x-1/2 items-center justify-center gap-2',
      props.positionClass,
    ]"
  >
    <!-- Active dot: w-6, full opacity; Inactive: w-1.5, 30% opacity -->
    <button
      v-for="(_, index) in Array(total)"
      :key="index"
      :class="[
        'h-2 rounded-full transition-all',
        selected === index ? 'w-8' : 'w-2',
        props.indicatorClass || (selected === index ? 'bg-primary-500' : 'bg-neutral-300'),
      ]"
      @click="emit('dot-click', index)"
      :aria-label="`Go to slide ${index + 1} of ${total}`"
      :aria-current="selected === index ? 'true' : 'false'"
    />
  </div>
</template>
