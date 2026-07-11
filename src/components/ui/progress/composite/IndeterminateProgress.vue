<script setup lang="ts">
  import { computed } from 'vue'
  import { cn } from '@/utils/cn'

  /**
   * Indeterminate progress bar — a thin, animated shimmer sweep used to
   * communicate "something is happening" without a known duration.
   *
   * Modeled after GitHub / YouTube / Vercel top-of-page loaders:
   *  - Thin rail (default 3px) so it doesn't dominate
   *  - Two overlapping bars with different keyframes and easing — this is
   *    the trick that makes the motion feel like Material's "query" loader
   *    rather than a single boring back-and-forth swipe
   *  - Uses `transform` only (no width animation) → GPU-accelerated
   */

  interface Props {
    /** Extra classes on the outer rail (e.g. `absolute top-0 left-0`) */
    class?: string
    /** Rail thickness (Tailwind height token). Defaults to `h-0.5` (2px). */
    thickness?: 'h-0.5' | 'h-1' | 'h-1.5' | 'h-2'
    /** Bar color (Tailwind bg token). Defaults to primary. */
    tone?: 'primary' | 'neutral' | 'success' | 'warning' | 'error'
  }

  const props = withDefaults(defineProps<Props>(), {
    thickness: 'h-0.5',
    tone: 'primary',
  })

  const toneClass = computed(
    () =>
      ({
        primary: 'bg-primary-500',
        neutral: 'bg-neutral-500',
        success: 'bg-success-500',
        warning: 'bg-warning-500',
        error: 'bg-error-500',
      })[props.tone],
  )

  const trackToneClass = computed(
    () =>
      ({
        primary: 'bg-primary-100/60',
        neutral: 'bg-neutral-200/60',
        success: 'bg-success-100/60',
        warning: 'bg-warning-100/60',
        error: 'bg-error-100/60',
      })[props.tone],
  )
</script>

<template>
  <div
    role="progressbar"
    aria-busy="true"
    :class="cn('relative w-full overflow-hidden', props.thickness, trackToneClass, props.class)"
  >
    <!-- Bar 1: covers ~35% of width, sweeps left→right on a 2.1s loop -->
    <span :class="cn('indeterminate-bar-1 absolute inset-y-0 left-0 rounded-full', toneClass)" />
    <!-- Bar 2: covers ~55% of width, sweeps with different easing on a 2.1s
         loop but offset by 1.15s — the two together produce the classic
         "query" indeterminate motion (never a dead moment). -->
    <span :class="cn('indeterminate-bar-2 absolute inset-y-0 left-0 rounded-full', toneClass)" />
  </div>
</template>

<style scoped>
  .indeterminate-bar-1 {
    width: 35%;
    animation: indeterminate-1 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
  }

  .indeterminate-bar-2 {
    width: 55%;
    animation: indeterminate-2 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
    animation-delay: 1.15s;
  }

  @keyframes indeterminate-1 {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(300%);
    }
  }

  @keyframes indeterminate-2 {
    0% {
      transform: translateX(-150%);
    }
    100% {
      transform: translateX(250%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .indeterminate-bar-1,
    .indeterminate-bar-2 {
      animation: none;
    }
    .indeterminate-bar-1 {
      width: 100%;
      opacity: 0.4;
    }
    .indeterminate-bar-2 {
      display: none;
    }
  }
</style>
