<script setup lang="ts">
  import { CheckCircle2 } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { TextField } from '@/components/ui/form'
  import { FIELD_LABELS } from './constants'
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

  const props = defineProps<Props>()

  const emit = defineEmits<{
    reset: []
    editLevel: [level: LocationLevel]
  }>()

  /** Field configuration for data-driven rendering */
  const LOCATION_FIELDS: {
    level: LocationLevel
    placeholder: string
    showWhen: () => boolean
    getValue: () => string | undefined
  }[] = [
    {
      level: 'province',
      placeholder: 'Pilih Provinsi',
      showWhen: () => true, // Always show
      getValue: () => props.provinceName,
    },
    {
      level: 'city',
      placeholder: 'Pilih Kota',
      showWhen: () => !!props.provinceName,
      getValue: () => props.cityName,
    },
    {
      level: 'district',
      placeholder: 'Pilih Kecamatan',
      showWhen: () => !!props.cityName,
      getValue: () => props.districtName,
    },
  ]
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
          @click="emit('reset')"
        >
          Atur Ulang
        </Button>
      </div>

      <!-- Location Fields - Data-driven rendering -->
      <template v-for="field in LOCATION_FIELDS" :key="field.level">
        <TextField
          v-if="field.showWhen()"
          :label="FIELD_LABELS[field.level]"
          :model-value="field.getValue()"
          :suffix-icon="field.getValue() ? CheckCircle2 : undefined"
          :placeholder="field.placeholder"
          input-class="cursor-pointer"
          readonly
          @click="emit('editLevel', field.level)"
        />
      </template>
    </div>
  </div>
</template>
