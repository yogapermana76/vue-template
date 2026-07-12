<script setup lang="ts">
  import { computed } from 'vue'
  import { RotateCcw, Tag } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { SearchableSelectField, type ComboboxOption } from '@/components/ui/combobox'
  import { DateRangePickerField } from '@/components/ui/date-picker'
  import { useIsoDateRange } from '@/composables/ui'
  import type { Category } from '@/types/services'
  import type { DateRange } from '../types'

  const props = defineProps<{
    categories: Category[]
    categoryId?: number
    dateRange: DateRange
    disabled?: boolean
  }>()

  const emit = defineEmits<{
    'update:categoryId': [value: number | undefined]
    'update:dateRange': [value: DateRange]
    reset: []
  }>()

  const categoryOptions = computed<ComboboxOption<number>[]>(() =>
    props.categories.map(c => ({ value: c.ID, label: c.Name })),
  )

  const category = computed<number | undefined>({
    get: () => props.categoryId,
    set: v => emit('update:categoryId', v),
  })

  const dateRangeAdapter = useIsoDateRange(
    () => props.dateRange.start,
    () => props.dateRange.end,
    (start, end) => emit('update:dateRange', { start, end }),
  )

  const hasFilters = computed(
    () => !!props.categoryId || !!props.dateRange.start || !!props.dateRange.end,
  )
</script>

<template>
  <div class="flex flex-col gap-3 md:flex-row md:items-end">
    <div class="grid flex-1 gap-3 sm:grid-cols-2">
      <SearchableSelectField
        v-model="category"
        :options="categoryOptions"
        label="Kategori"
        placeholder="Semua kategori"
        search-placeholder="Cari kategori..."
        empty-text="Kategori tidak ditemukan"
        :prefix-icon="Tag"
        :disabled="disabled"
        clearable
      />
      <DateRangePickerField
        v-model="dateRangeAdapter"
        label="Rentang Tanggal"
        placeholder="Pilih rentang tanggal"
        :disabled="disabled"
      />
    </div>

    <Button
      variant="secondary"
      size="md"
      class="shrink-0 md:mb-0.5"
      :disabled="disabled || !hasFilters"
      @click="emit('reset')"
    >
      <RotateCcw class="size-4" />
      Reset
    </Button>
  </div>
</template>
