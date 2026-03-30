<script setup lang="ts">
  import { computed } from 'vue'
  import { cn } from '@/utils/cn'

  /**
   * CarouselContent Component
   *
   * Universal container for carousel items with flexible spacing control.
   * Based on official Embla Carousel documentation best practices.
   *
   * Official Embla Approach to Spacing:
   * ===================================
   * Embla Carousel uses CSS-based spacing (flex gap) for consistency.
   * This approach works identically for:
   * - Infinite loops (loop: true)
   * - Fixed-length carousels (loop: false)
   * - Single or multi-column layouts
   * - Any responsive configuration
   *
   * Why CSS Gap (Not Hardcoded Margins):
   * - Gap is applied via flex container property
   * - Works naturally with flex-shrink-0 and min-w-0 on items
   * - No special handling needed for infinite vs fixed carousels
   * - Responsive via Tailwind (gap-4 → gap-6 at different breakpoints)
   * - Official documentation recommends gap-based spacing over margins
   *
   * Gap Sizing Guide (Per Embla Best Practices):
   * - gap-4: 16px (compact layouts, dense grids, mobile)
   * - gap-6: 24px (DEFAULT - balanced for all carousel types)
   * - gap-8: 32px (spacious layouts, hero sections, desktop)
   *
   * Why gap-6 as Universal Default:
   * - Consistent across loop: true and loop: false
   * - Works with Embla's cloning mechanism for infinite loops
   * - Matches Embla playground examples
   * - Responsive via Tailwind media queries
   * - Works with any item count (1, 2, 3, 4, 5+ columns)
   *
   * Reference: github.com/davidjerleke/embla-carousel
   * Examples use gap-based spacing with no special containScroll handling
   */
  interface Props {
    /**
     * CSS gap class between carousel items (OPTIONAL)
     *
     * Applied via flex container (flex gap property) ONLY if specified.
     * If not provided, carousel items will have NO spacing between them.
     *
     * Embla Official Spacing Strategy:
     * - gap-4 (16px): Compact, mobile-first layouts
     * - gap-6 (24px): Balanced spacing for multi-item carousels
     * - gap-8 (32px): Spacious layouts, hero sections
     *
     * When NOT to use gap:
     * - Full-width carousels (basis="full") with single item
     * - Full-bleed hero banners without spacing
     * - When you want items touching edge-to-edge
     *
     * All values work consistently with:
     * - Infinite carousels (loop: true)
     * - Fixed carousels (loop: false)
     * - Any item width configuration (full, 1/2, 1/3, 1/4, 1/5)
     * - Responsive breakpoints
     *
     * @example
     * // Multi-item carousel with spacing
     * <CarouselContent gap="gap-6">...</CarouselContent>
     *
     * @example
     * // Full-width carousel without spacing
     * <CarouselContent>...</CarouselContent>
     *
     * @example
     * // Responsive spacing
     * <CarouselContent gap="gap-4 md:gap-6 lg:gap-8">...</CarouselContent>
     *
     * @default undefined - no gap/padding applied
     */
    gap?: 'gap-2' | 'gap-3' | 'gap-4' | 'gap-6' | 'gap-8'

    /** Additional CSS classes for wrapper customization */
    class?: string
  }

  /**
   * Gap-to-padding transformation
   *
   * Converts gap classes to their padding equivalents for carousel boundaries.
   * Supports responsive breakpoints out of the box.
   *
   * Mapping:
   * - gap-2 → px-2 (8px)
   * - gap-3 → px-3 (12px)
   * - gap-4 → px-4 (16px)
   * - gap-6 → px-6 (24px) - RECOMMENDED
   * - gap-8 → px-8 (32px)
   */

  /**
   * Factory: Create responsive padding transformer
   *
   * SOLID Principles Applied:
   * - Single Responsibility: Transform gap classes to padding classes
   * - Open/Closed: Easy to add new mappings without changing logic
   * - Dependency Inversion: Logic depends on config parameter, not hardcoded
   *
   * Simplified & Maintainable Design:
   * - Extracted helper functions for clarity
   * - Each step has single, clear responsibility
   * - No nested complexity or deeply nested logic
   * - Explicit guard clauses instead of buried conditionals
   *
   * CRITICAL FIX: Robust responsive class handling
   * - Properly handles "gap-4 md:gap-6 lg:gap-8" format
   * - Preserves all breakpoint prefixes during transformation
   * - Works with any Tailwind breakpoint (sm, md, lg, xl, 2xl, etc.)
   * - Fails gracefully if gap class not in config (returns original)
   *
   * Algorithm:
   * 1. Split string by whitespace into tokens
   * 2. For each token, parse gap class (with optional breakpoint prefix)
   * 3. If match found, replace gap class with corresponding padding class
   * 4. Return transformed tokens joined back
   *
   * Examples:
   * - "gap-6" → "px-6"
   * - "gap-4 md:gap-6" → "px-4 md:px-6"
   * - "gap-2 sm:gap-4 lg:gap-6" → "px-2 sm:px-4 lg:px-6"
   *
   * @param config - Mapping configuration (gap class → padding class)
   * @returns Pure function that transforms gap strings to padding strings
   */

  /**
   * Simple & Maintainable Responsive Padding Transformation
   *
   * Best Practice for Long-term Maintainability:
   * - Zero complexity - single responsibility
   * - No regex parsing or complex logic
   * - Works with responsive gaps (e.g., "gap-4 md:gap-6 lg:gap-8")
   * - Easy for team to understand and extend
   *
   * Strategy:
   * 1. For infinite carousels, padding prevents cramped boundaries
   * 2. For finite carousels, padding adds breathing room
   * 3. Simple string transformation covers all use cases
   * 4. No need for per-token parsing or regex matching
   *
   * Examples:
   * - "gap-4" → "px-4"
   * - "gap-6" → "px-6"
   * - "gap-4 md:gap-6 lg:gap-8" → "px-4 md:px-6 lg:px-8"
   *
   * This approach is:
   * - Testable: Simple input → output mapping
   * - Maintainable: No hidden logic or state
   * - Extensible: Easy to add new gap/padding values
   * - Performant: Single regex replace, no loops
   */
  const transformGapToPadding = (gapClasses: string): string => {
    return gapClasses.replace(/\bgap-/g, 'px-')
  }

  const props = withDefaults(defineProps<Props>(), {
    // No default gap - gap/padding only applied if explicitly specified
    // This respects user intent: carousel without gap specification = no spacing
  })

  /**
   * Compute responsive padding from gap classes
   *
   * Only returns padding if gap prop is provided.
   * This ensures:
   * - No unwanted spacing on full-width carousels
   * - No forced defaults
   * - Explicit control for developer
   *
   * Returns:
   * - Padding classes if gap is provided (e.g., "px-6")
   * - Empty string if gap is undefined (no padding)
   */
  const responsivePadding = computed(() => {
    if (!props.gap) return ''
    return transformGapToPadding(props.gap)
  })
</script>

<template>
  <!--
    Flex container for carousel items with optional CSS gap-based spacing

    Official Embla Carousel Implementation:
    - Uses flex gap (not margins or padding on items)
    - Gap property applied ONLY if specified by consumer
    - Works naturally with item flex-basis constraints

    Optional Spacing Behavior:
    - If gap prop provided: gap applies between items, padding created for boundaries
    - If gap prop omitted: NO gap, NO padding - items touch edge-to-edge
    - Responsive gaps: "gap-4 md:gap-6 lg:gap-8" supported

    Infinite Loop Padding (When Gap Specified):
    - For loop: true carousels, padding matches gap value
    - Creates breathing room for cloned boundary items
    - Prevents "dempet" (stuck) appearance at loop boundaries
    - Padding formula: full gap value for visual alignment

    CSS Classes When Gap Specified:
    - gap-X: Dynamic spacing between items (gap-2 through gap-8)
    - px-*: Horizontal padding for infinite loop boundaries
    - flex: Activates flexbox layout for horizontal scrolling
    - w-full: Takes full carousel container width

    Embla Integration:
    - flex-shrink-0 on items prevents shrinking below their basis
    - min-w-0 on items allows content wrapping
    - flex gap handles spacing - no CSS tricks needed
    - Works identically for loop: true and loop: false

    Usage Examples:
    - Multi-item with spacing: <CarouselContent gap="gap-6">
    - Full-width no spacing: <CarouselContent> (gap omitted)
    - Responsive: <CarouselContent gap="gap-4 md:gap-6">
  -->
  <div :class="cn('flex w-full', props.gap, responsivePadding, props.class)">
    <slot />
  </div>
</template>
