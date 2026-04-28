<script setup lang="ts">
  import { Divider } from '@/components/ui/divider'
  import { ContactInfoItem } from '@/components/lifestyle/cards/contact-info-item'
  import {
    LifestylePromoCodeSection,
    LifestylePaymentInfoSection,
  } from '@/components/lifestyle/sections/order'
  import type { PaymentBreakdown } from '@/components/lifestyle/sections/order/LifestylePaymentInfoSection.vue'
  import type { VisitorInfo } from '@/components/lifestyle/sections/order/LifestyleOrderInfoSection.vue'

  const VISITOR_LIST_TITLE = 'Informasi Pemesanan'

  export interface LifestyleBookingStep3SectionProps {
    /** List of visitors */
    visitors: VisitorInfo[]
    /** Payment breakdown details */
    paymentBreakdown: PaymentBreakdown
    /** Whether terms are agreed */
    termsAgreed: boolean
  }

  defineProps<LifestyleBookingStep3SectionProps>()

  defineEmits<{
    'update:terms-agreed': [value: boolean]
    'apply-promo': []
  }>()

  // Internal handler for view terms
  function handleViewTerms() {
    // TODO: Open terms and conditions modal/sheet
    // eslint-disable-next-line no-console
    console.log('View terms clicked')
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Visitor List -->
    <section class="flex flex-col gap-3 px-4">
      <h2 class="body-l-semibold text-slate-950">{{ VISITOR_LIST_TITLE }}</h2>
      <div class="flex flex-col gap-3">
        <ContactInfoItem
          v-for="visitor in visitors"
          :key="visitor.id"
          :name="`${visitor.name} (${visitor.type})`"
          :email="visitor.email"
          :phone="visitor.phone"
          :clickable="false"
        />
      </div>
    </section>

    <Divider thick />

    <div class="px-4">
      <LifestylePromoCodeSection @apply-promo="$emit('apply-promo')" />
    </div>

    <Divider thick />

    <!-- Payment Info -->
    <LifestylePaymentInfoSection
      :breakdown="paymentBreakdown"
      :agreed-to-terms="termsAgreed"
      @update:agreed-to-terms="$emit('update:terms-agreed', $event)"
      @view-terms="handleViewTerms"
    />
  </div>
</template>
