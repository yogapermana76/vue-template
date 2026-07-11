<script setup lang="ts">
  import { computed } from 'vue'
  import { formatDateRangeInTZ } from '@/utils/date'
  import type { LoketBannerURL, LoketProgram } from '@/types/services/loket'
  import HeroBannerLayer from './hero/HeroBannerLayer.vue'
  import HeroIdentityOverlay from './hero/HeroIdentityOverlay.vue'

  const props = defineProps<{
    program: LoketProgram | undefined
    banners: LoketBannerURL[]
    loading?: boolean
  }>()

  const displayTitle = computed(
    () => props.program?.Name || props.program?.Title || 'Pilih program',
  )

  // No Timezone on this endpoint — the helper falls back to Asia/Jakarta.
  const periodLabel = computed(
    () => formatDateRangeInTZ(props.program?.StartDate, props.program?.EndDate) || null,
  )
</script>

<template>
  <section
    class="relative h-72 overflow-hidden rounded-md border border-neutral-200 bg-neutral-900 shadow-sm sm:h-96"
  >
    <HeroBannerLayer :banners="banners" :loading="loading" />
    <HeroIdentityOverlay :title="displayTitle" :period-label="periodLabel" :loading="loading">
      <template v-if="$slots.switcher" #switcher>
        <slot name="switcher" />
      </template>
    </HeroIdentityOverlay>
  </section>
</template>
