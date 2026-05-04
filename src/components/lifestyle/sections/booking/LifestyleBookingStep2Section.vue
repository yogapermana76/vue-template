<script setup lang="ts">
  import { LifestyleOrderInfoSection } from '@/components/lifestyle/sections/order'
  import type {
    VisitorInfo,
    BuyerInfo,
  } from '@/components/lifestyle/sections/order/LifestyleOrderInfoSection.vue'

  export interface LifestyleBookingStep2SectionProps {
    /** Whether user is first visitor */
    isFirstVisitor: boolean
    /** List of visitors */
    visitors: VisitorInfo[]
    /** Buyer information */
    buyerInfo: BuyerInfo
  }

  defineProps<LifestyleBookingStep2SectionProps>()

  defineEmits<{
    'update:is-first-visitor': [value: boolean]
    'update:visitors': [visitors: VisitorInfo[]]
    'visitor-edit': [visitorId: string]
  }>()
</script>

<template>
  <LifestyleOrderInfoSection
    :is-first-visitor="isFirstVisitor"
    :visitors="visitors"
    :buyer-info="buyerInfo"
    @update:is-first-visitor="$emit('update:is-first-visitor', $event)"
    @update:visitors="$emit('update:visitors', $event)"
    @visitor-edit="$emit('visitor-edit', $event)"
  />
</template>
