<script setup lang="ts">
  import { cn } from '@/utils/cn'

  /**
   * CarouselItem Component
   *
   * Universal carousel item wrapper for ANY carousel configuration.
   *
   * Key Purpose:
   * Flex shrink prevention - ensures items maintain their size and don't
   * collapse when container is full. Critical for proper Embla carousel behavior.
   *
   * Embla Carousel Flex Requirements:
   * 1. flex-shrink-0 - Prevents items from shrinking smaller than their basis
   * 2. min-w-0 - Allows text overflow truncation inside items
   * 3. basis-X - Controls item initial size (20%, 25%, 33%, 50%, 100%)
   *
   * These three classes work together to ensure:
   * - Items stay correct size even when carousel is full
   * - Text inside items can wrap/truncate properly
   * - Embla can calculate snap positions accurately
   * - Works identically for infinite and fixed-length carousels
   *
   * Usage Examples:
   * - Full width slides: basis="full" (hero, banners)
   * - Two columns: basis="1/2" (tablet view)
   * - Three columns: basis="1/3" (testimonials)
   * - Four columns: basis="1/4" (products)
   * - Five columns: basis="1/5" (thumbnails)
   */
  interface Props {
    /**
     * Flex basis (initial size) for carousel item
     * Controls how much carousel space this item occupies
     *
     * Values represent viewport portion the item should take:
     * - full: 100% (entire slide)
     * - 1/2: 50% (two items per carousel width)
     * - 1/3: 33.333% (three items)
     * - 1/4: 25% (four items)
     * - 1/5: 20% (five items - thumbnail gallery)
     *
     * @default 'full'
     */
    basis?: 'full' | '1/2' | '1/3' | '1/4' | '1/5'

    /** Additional CSS classes for item customization */
    class?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    basis: 'full',
  })

  /**
   * Tailwind basis utility class mapping
   * These classes control flex-basis which determines item width
   */
  const basisMap: Record<string, string> = {
    full: 'basis-full', // 100% width
    '1/2': 'basis-1/2', // 50% width
    '1/3': 'basis-1/3', // 33.333% width
    '1/4': 'basis-1/4', // 25% width
    '1/5': 'basis-1/5', // 20% width
  }
</script>

<template>
  <!--
    Core carousel item wrapper with critical flex properties

    CSS Classes:
    1. flex-shrink-0: CRITICAL - prevents item from shrinking smaller than basis
       Without this, items collapse when carousel is full

    2. min-w-0: Allows content inside to wrap/truncate properly
       Without this, text stretches items beyond their base size

    3. basisMap[basis]: Flex basis - initial width of item
       Embla uses this to calculate snap points and scrolling distances

    These work together to let Embla accurately:
    - Calculate snap positions
    - Detect scroll boundaries
    - Handle responsive resizing
    - Work with both infinite and fixed carousels

    Custom properties from parent are merged in without affecting
    the critical shrink/width properties
  -->
  <div :class="cn('min-w-0 shrink-0', basisMap[props.basis], props.class)">
    <slot />
  </div>
</template>
