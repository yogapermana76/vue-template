<script setup lang="ts">
  import type { Component } from 'vue'
  import MapPinIcon from '@/assets/icons/map-pin.svg?component'

  interface ProgramInfo {
    title: string
    description: string
  }

  interface Stat {
    id: string
    label: string
    value: string
    icon: Component
  }

  interface Address {
    fullname: string
    phoneNumber: string
    provinceName: string
    cityName: string
    districtName: string
    postalCode: string
  }

  interface Props {
    programInfo: ProgramInfo
    stats?: Stat[]
    address?: Address
  }

  withDefaults(defineProps<Props>(), {
    stats: () => [],
  })
</script>

<template>
  <section class="flex flex-col gap-4">
    <!-- Title & Description -->
    <div class="flex flex-col gap-1">
      <h1 class="heading-s text-slate-950">{{ programInfo.title }}</h1>
      <p class="body-caption text-slate-600">{{ programInfo.description }}</p>
    </div>

    <!-- Stats Card (only show if stats exist) -->
    <div v-if="stats.length > 0" class="bg-primary-50 flex flex-col gap-3 rounded-sm p-3">
      <div v-for="stat in stats" :key="stat.id" class="flex flex-col gap-1">
        <span class="body-caption-medium text-slate-800">{{ stat.label }}</span>
        <div class="flex items-center gap-1.5">
          <component :is="stat.icon" class="text-primary-600 size-4 shrink-0" />
          <span class="body-m-medium text-slate-950">{{ stat.value }}</span>
        </div>
      </div>
    </div>

    <!-- Address Section (only show if address exists) -->
    <div v-if="address" class="flex flex-col gap-2 py-3">
      <h2 class="body-m-semibold text-slate-950">Alamat</h2>
      <div class="flex items-start gap-2">
        <MapPinIcon class="mt-0.5 size-5 shrink-0" />
        <div class="flex flex-1 flex-col justify-center gap-1">
          <div class="flex items-center gap-1">
            <span class="body-m text-slate-950">{{ address.fullname }}</span>
            <span class="body-caption text-slate-700/75">({{ address.phoneNumber }})</span>
          </div>
          <p class="body-caption-medium text-slate-700">
            {{ address.districtName }}, {{ address.cityName }}, {{ address.provinceName }},
            {{ address.postalCode }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
