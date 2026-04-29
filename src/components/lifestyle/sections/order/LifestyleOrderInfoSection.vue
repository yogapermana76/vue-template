<script setup lang="ts">
  import { computed } from 'vue'
  import { Switch } from '@/components/ui/switch'
  import { AlertBox } from '@/components/ui/alert'
  import { ContactInfoItem } from '@/components/lifestyle/cards/contact-info-item'

  export interface VisitorInfo {
    id: string
    type: string
    [key: string]: string | undefined
  }

  export interface BuyerInfo {
    fullName: string
    email: string
    phoneNumber?: string
  }

  export interface LifestyleOrderInfoSectionProps {
    /** Whether user is set as first visitor */
    isFirstVisitor: boolean
    /** List of visitors */
    visitors: VisitorInfo[]
    /** Buyer information */
    buyerInfo: BuyerInfo
  }

  const props = defineProps<LifestyleOrderInfoSectionProps>()

  const emit = defineEmits<{
    'update:isFirstVisitor': [value: boolean]
    'update:visitors': [visitors: VisitorInfo[]]
    'visitor-edit': [visitorId: string]
  }>()

  // Computed buyer info for consistency
  const buyerData = computed(() => props.buyerInfo)

  // Helper functions
  function isVisitorEmpty(visitor: VisitorInfo): boolean {
    return !visitor.name || !visitor.email || !visitor.phone
  }

  function shouldUseBuyerData(index: number): boolean {
    return index === 0 && props.isFirstVisitor
  }

  function hasValidBuyerData(buyer: BuyerInfo): boolean {
    return !!(buyer.fullName && buyer.email)
  }

  function getDisplayValue<T>(
    useBuyerData: boolean,
    buyerValue: T | undefined,
    visitorValue: T | undefined,
    isEmpty: boolean,
  ): T | undefined {
    if (useBuyerData && buyerValue !== undefined) {
      return buyerValue
    }
    return isEmpty ? undefined : visitorValue
  }

  function getVisitorDisplayName(visitor: VisitorInfo, index: number, buyer: BuyerInfo): string {
    const useBuyerData = shouldUseBuyerData(index)

    if (useBuyerData && buyer.fullName) {
      return buyer.fullName
    }

    if (isVisitorEmpty(visitor)) {
      return `Isi Data Pengunjung ${index + 1}`
    }

    return (visitor.name as string) || ''
  }

  function formatVisitorDisplayName(
    displayName: string,
    displayType: string | undefined,
    isEmpty: boolean,
  ): string {
    return isEmpty ? displayName : `${displayName} (${displayType})`
  }

  // Computed properties
  const loginMessage = computed(() => {
    const buyer = buyerData.value
    return buyer.fullName ? `Anda login sebagai ${buyer.fullName}` : 'Anda login sebagai Tamu'
  })

  const displayVisitors = computed(() => {
    const buyer = buyerData.value
    return props.visitors.map((visitor, index) => {
      const isEmpty = isVisitorEmpty(visitor)
      const useBuyerData = shouldUseBuyerData(index) && hasValidBuyerData(buyer)
      const isEmptyDisplay = isEmpty && !useBuyerData

      const displayName = getVisitorDisplayName(visitor, index, buyer)
      const displayEmail = getDisplayValue(
        useBuyerData,
        buyer.email,
        visitor.email as string | undefined,
        isEmpty,
      )
      const displayPhone = getDisplayValue(
        useBuyerData,
        buyer.phoneNumber,
        visitor.phone as string | undefined,
        isEmpty,
      )
      const displayType = isEmptyDisplay ? undefined : (visitor.type as string)
      const fullDisplayName = formatVisitorDisplayName(displayName, displayType, isEmptyDisplay)

      return {
        ...visitor,
        isEmpty: isEmptyDisplay,
        displayName,
        displayEmail,
        displayPhone,
        displayType,
        fullDisplayName,
      }
    })
  })

  function createEmptyVisitor(baseVisitor: VisitorInfo): VisitorInfo {
    return {
      ...baseVisitor,
      name: '',
      email: '',
      phone: '',
    }
  }

  function createVisitorFromBuyer(baseVisitor: VisitorInfo, buyer: BuyerInfo): VisitorInfo {
    return {
      ...baseVisitor,
      name: buyer.fullName,
      email: buyer.email,
      phone: buyer.phoneNumber || '',
    }
  }

  function updateFirstVisitor(visitors: VisitorInfo[], isEnabled: boolean): VisitorInfo[] {
    if (visitors.length === 0) {
      return visitors
    }

    const updatedVisitors = [...visitors]
    const buyer = buyerData.value

    if (isEnabled && hasValidBuyerData(buyer)) {
      updatedVisitors[0] = createVisitorFromBuyer(visitors[0], buyer)
    } else if (!isEnabled) {
      updatedVisitors[0] = createEmptyVisitor(visitors[0])
    }

    return updatedVisitors
  }

  function handleToggleChange(value: boolean) {
    emit('update:isFirstVisitor', value)

    const updatedVisitors = updateFirstVisitor(props.visitors, value)
    if (updatedVisitors !== props.visitors) {
      emit('update:visitors', updatedVisitors)
    }
  }
</script>

<template>
  <section class="flex flex-col gap-4 px-4">
    <h2 class="body-l-semibold text-slate-950">Informasi Pemesan</h2>

    <AlertBox variant="info" :icon="true">
      <span class="body-caption text-primary-800">{{ loginMessage }}</span>
    </AlertBox>

    <ContactInfoItem
      :name="props.buyerInfo.fullName"
      :email="props.buyerInfo.email"
      :phone="props.buyerInfo.phoneNumber"
      :clickable="false"
    />

    <div class="flex items-center justify-between gap-3">
      <span class="body-m flex-1 text-slate-950">Atur sebagai pengunjung 1</span>
      <Switch :checked="props.isFirstVisitor" @update:checked="handleToggleChange" />
    </div>

    <div class="flex flex-col gap-3">
      <h2 class="body-l-semibold text-slate-950">Informasi Pengunjung</h2>
      <div class="flex flex-col gap-3">
        <ContactInfoItem
          v-for="visitor in displayVisitors"
          :key="visitor.id"
          :name="visitor.fullDisplayName"
          :email="visitor.displayEmail"
          :phone="visitor.displayPhone"
          :clickable="true"
          @click="$emit('visitor-edit', visitor.id)"
        />
      </div>
    </div>
  </section>
</template>
