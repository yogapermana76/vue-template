<script setup lang="ts">
  import { Divider } from '@/components/ui/divider'

  interface RedemptionDetail {
    serviceType: string
    invoice: string
    transactionDate: string
    pointsRedeemed: number
    totalPoints: number
  }

  const redemptionData: RedemptionDetail = {
    serviceType: 'Event',
    invoice: 'IVR/20200202/XX/II/332177702',
    transactionDate: '09 Januari 2026, 19:55 WIB',
    pointsRedeemed: 50,
    totalPoints: 50,
  }
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- Detail Penukaran Section -->
    <div class="flex w-full flex-col gap-3 px-4">
      <h2 class="body-l-semibold text-slate-950">Detail Penukaran</h2>

      <!-- Service Type -->
      <div class="flex w-full items-center justify-between gap-2">
        <span class="body-caption text-slate-700">Jenis Layanan</span>
        <span class="body-caption text-slate-950">{{ redemptionData.serviceType }}</span>
      </div>
    </div>

    <!-- Divider with background -->
    <Divider thick class="w-full bg-neutral-50" />

    <!-- Detail Transaksi Section -->
    <div class="flex w-full flex-col gap-3 px-4">
      <h2 class="body-l-semibold text-slate-950">Detail Transaksi</h2>

      <div class="flex w-full flex-col gap-2">
        <!-- Invoice -->
        <div class="flex flex-col gap-1">
          <span class="body-caption text-slate-700">Invoice</span>
          <span class="body-m text-slate-950">{{ redemptionData.invoice }}</span>
        </div>

        <!-- Transaction Date -->
        <div class="flex flex-col gap-1">
          <span class="body-caption text-slate-700">Tanggal Transaksi</span>
          <span class="body-m text-slate-950">{{ redemptionData.transactionDate }}</span>
        </div>
      </div>
    </div>

    <!-- Divider with background -->
    <Divider thick class="w-full bg-neutral-50" />

    <!-- Points Summary Section -->
    <div class="flex w-full flex-col gap-3 px-4">
      <h2 class="body-l-semibold text-slate-950">Informasi Penukaran</h2>

      <div class="flex w-full flex-col gap-2">
        <!-- Points Redeemed -->
        <div class="flex items-center justify-between gap-2">
          <span class="body-caption text-slate-700">Poin yang ditukar</span>
          <span class="body-caption text-slate-950">{{ redemptionData.pointsRedeemed }}</span>
        </div>

        <!-- Dashed Divider -->
        <Divider variant="dashed" class="border-neutral-400/20" />

        <!-- Total Points -->
        <div class="flex items-center justify-between gap-2">
          <span class="body-m text-primary-600">Total poin</span>
          <span class="body-m text-primary-600">{{ redemptionData.totalPoints }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
