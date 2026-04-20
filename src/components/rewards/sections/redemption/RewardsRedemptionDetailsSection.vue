<script setup lang="ts">
  import { Divider } from '@/components/ui/divider'
  import MapPinIcon from '@/assets/icons/map-pin.svg?component'
  import HistoryIcon from '@/assets/icons/history.svg?component'
  import { formatDate } from '@/utils/date'
  import { formatNumber } from '@/utils/currency'
  import type { ExchangePointDetail } from '@/types/services'

  interface RedemptionDetailProps {
    data?: ExchangePointDetail | null
  }

  const props = withDefaults(defineProps<RedemptionDetailProps>(), {
    data: null,
  })
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- Detail Penukaran Section -->
    <div class="flex w-full flex-col gap-3 px-4">
      <h2 class="body-l-semibold text-slate-950">Detail Penukaran</h2>

      <!-- Service Type / Title -->
      <div class="flex w-full items-center justify-between gap-2">
        <span class="body-caption text-slate-800">Jenis Layanan</span>
        <span class="body-caption text-slate-950">{{
          props.data?.typeOfService || props.data?.title || '-'
        }}</span>
      </div>

      <!-- Description Card (if available) -->
      <div
        v-if="props.data?.description"
        class="flex w-full flex-row items-center gap-3 rounded-sm border border-slate-200 bg-white px-3 py-3"
      >
        <HistoryIcon class="size-8 shrink-0" />
        <div class="flex flex-1 flex-col">
          <p class="body-m-medium text-slate-700">{{ props.data.description }}</p>
          <p class="body-m-medium text-primary-700">
            {{ formatNumber(Math.abs(props.data?.point || 0)) }} Poin
          </p>
        </div>
      </div>
    </div>

    <!-- Divider with background -->
    <Divider thick class="w-full bg-neutral-50" />

    <!-- Detail Transaksi Section -->
    <div class="flex w-full flex-col gap-3 px-4">
      <h2 class="body-l-semibold text-slate-950">Detail Transaksi</h2>

      <div class="flex w-full flex-col gap-2">
        <!-- Created Date -->
        <div class="flex flex-col gap-1">
          <span class="body-caption text-slate-700">Tanggal Transaksi</span>
          <span class="body-m text-slate-950">{{
            props.data?.created ? formatDate(props.data.created, "dd MMMM yyyy, HH:mm 'WIB'") : '-'
          }}</span>
        </div>
      </div>
    </div>

    <!-- Divider with background -->
    <Divider thick class="w-full bg-neutral-50" />

    <!-- Alamat Pengiriman Section -->
    <div v-if="props.data?.address" class="flex w-full flex-col gap-3 px-4">
      <h2 class="body-l-semibold text-slate-950">Alamat Pengiriman</h2>

      <div class="flex items-start gap-2">
        <MapPinIcon class="mt-0.5 size-5 shrink-0" />
        <div class="flex flex-1 flex-col gap-1">
          <div class="flex items-center gap-1">
            <span class="body-m text-slate-950">Name</span>
            <span class="body-caption text-slate-700/75">(Phone)</span>
          </div>
          <!-- Address Info -->
          <p class="body-caption-medium text-slate-700">
            {{ props.data.address.address }}, {{ props.data.address.districtName }},
            {{ props.data.address.cityName }}, {{ props.data.address.postalCode }}
          </p>
        </div>
      </div>
    </div>

    <!-- Divider with background -->
    <Divider v-if="props.data?.address" thick class="w-full bg-neutral-50" />

    <!-- Points Summary Section -->
    <div class="flex w-full flex-col gap-3 px-4">
      <h2 class="body-l-semibold text-slate-950">Informasi Penukaran</h2>

      <div class="flex w-full flex-col gap-2">
        <!-- Points Redeemed -->
        <div class="flex items-center justify-between gap-2">
          <span class="body-caption text-slate-700">Poin yang ditukar</span>
          <span class="body-caption text-slate-950">{{
            formatNumber(Math.abs(props.data?.point || 0))
          }}</span>
        </div>

        <!-- Dashed Divider -->
        <Divider variant="dashed" class="border-neutral-400/20" />

        <!-- Total Points -->
        <div class="flex items-center justify-between gap-2">
          <span class="body-m text-primary-600">Total poin</span>
          <span class="body-m text-primary-600">{{
            formatNumber(Math.abs(props.data?.point || 0))
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
