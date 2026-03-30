<script setup lang="ts">
  /**
   * CarouselIndicators Component
   *
   * Universal visual indicators for ANY carousel type:
   * - Shows total number of slides/snap points
   * - Shows currently selected slide
   * - Provides direct navigation via click (optional but recommended)
   * - Works with infinite and fixed carousels
   * - Works with any layout (single column, multi-column, etc)
   *
   * Key Features:
   * - Simple dot-based design (minimal, standard)
   * - Absolute positioned at bottom center
   * - Smooth transition when active state changes
   * - Fully accessible with click event handling
   *
   * Integration:
   * Parent carousel should:
   * 1. Pass :total="scrollSnaps.length" - total snap points
   * 2. Pass :selected="selectedIndex" - current snap index
   * 3. Bind @dot-click="(index) => scrollTo(index)" - navigation handler
   *
   * Works correctly with:
   * - Infinite loops: indicators sync with cloned item boundaries
   * - Fixed carousels: indicators show all snap positions
   * - Auto-play: indicators update automatically on scroll
   * - Manual navigation: indicators update on button/drag interaction
   *
   * Visual Design:
   * - Inactive dot: 8px wide, 30% opacity, gray
   * - Active dot: 32px wide, full opacity, primary color
   * - Smooth transition between states (transition-all)
   */
  interface Props {
    /** Total number of snap points (usually slide count) */
    total: number

    /** Currently selected slide index (0-based) */
    selected: number

    /** Custom positioning classes for container (default: bottom-4 centered) */
    positionClass?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    positionClass: 'bottom-4',
  })

  const emit = defineEmits<{
    /**
     * Emitted when user clicks a dot indicator
     * Parent component should handle navigation via scrollTo(index)
     */
    'dot-click': [index: number]
  }>()
</script>

<template>
  <!--
    Indicator container

    Positioning:
    - absolute: Overlays carousel (not in document flow)
    - bottom-4: 16px from carousel bottom
    - left-1/2: Horizontally centered
    - -translate-x-1/2: Precise centering offset

    This positions indicators at bottom center, works for all carousel types.
    Spacing (bottom-4) adapts automatically to mobile/desktop via Tailwind.
  -->
  <div
    :class="[
      'absolute left-1/2 flex -translate-x-1/2 items-center justify-center gap-2',
      props.positionClass,
    ]"
  >
    <!--
      Indicator dots - one for each snap point

      Dynamic behavior:
      - selected === index ? active state : inactive state
      - Active: wider (w-8, 32px), full opacity, primary color
      - Inactive: narrow (w-2, 8px), reduced opacity, gray
      - transition-all: Smooth animation between states

      Works correctly with:
      - Infinite carousels (snap count = slide count)
      - Multi-column carousels (snap count = column count)
      - Auto-play (selected updates reactively)
    -->
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
