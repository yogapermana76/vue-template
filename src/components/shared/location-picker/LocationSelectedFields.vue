<script setup lang="ts">
  import { CheckCircle2 } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { TextField } from '@/components/ui/form'
  import type { LocationLevel } from './types'

  interface Props {
    /** Current active level */
    currentLevel: LocationLevel
    /** Selected province name */
    provinceName?: string
    /** Selected city name */
    cityName?: string
    /** Selected district name */
    districtName?: string
  }

  defineProps<Props>()

  const emit = defineEmits<{
    reset: []
    editProvince: []
    editCity: []
    editDistrict: []
  }>()

  const handleReset = () => {
    emit('reset')
  }

  const handleEditProvince = () => {
    emit('editProvince')
  }

  const handleEditCity = () => {
    emit('editCity')
  }

  const handleEditDistrict = () => {
    emit('editDistrict')
  }

  const getFieldLabel = (level: LocationLevel): string => {
    const labels = {
      province: 'Pilih Provinsi',
      city: 'Pilih Kota',
      district: 'Pilih Kecamatan',
    }
    return labels[level]
  }
</script>

<template>
  <div class="flex items-start justify-between py-4">
    <div class="flex-1 space-y-3">
      <div class="flex items-start justify-between">
        <h2 class="body-l-semibold text-neutral-950">Lokasi Terpilih</h2>
        <Button
          variant="tertiary"
          size="sm"
          class="mt-2 h-auto w-auto p-0 text-xs font-semibold"
          @click="handleReset"
        >
          Atur Ulang
        </Button>
      </div>

      <!-- Province Field - Always clickable -->
      <TextField
        :label="getFieldLabel('province')"
        :model-value="provinceName"
        :suffix-icon="provinceName ? CheckCircle2 : undefined"
        :input-class="'cursor-pointer'"
        placeholder="Pilih Provinsi"
        readonly
        @click="handleEditProvince"
      />

      <!-- City Field - Always clickable when visible -->
      <TextField
        v-if="provinceName"
        :label="getFieldLabel('city')"
        :model-value="cityName"
        :suffix-icon="cityName ? CheckCircle2 : undefined"
        input-class="cursor-pointer"
        placeholder="Pilih Kota"
        readonly
        @click="handleEditCity"
      />

      <!-- District Field - Always clickable when visible -->
      <TextField
        v-if="cityName"
        :label="getFieldLabel('district')"
        :model-value="districtName"
        :suffix-icon="districtName ? CheckCircle2 : undefined"
        input-class="cursor-pointer"
        placeholder="Pilih Kecamatan"
        readonly
        @click="handleEditDistrict"
      />
    </div>
  </div>
</template>
