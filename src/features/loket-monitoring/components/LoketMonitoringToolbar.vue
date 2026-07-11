<script setup lang="ts">
  import { computed } from 'vue'
  import { Download, Filter as FilterIcon } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { Badge } from '@/components/ui/badge'
  import { SearchInput } from '@/components/shared'

  const props = defineProps<{
    keyword: string
    claimed: boolean | undefined
    exporting?: boolean
    activeFilterCount?: number
    disabled?: boolean
  }>()

  const emit = defineEmits<{
    'update:keyword': [value: string]
    'update:claimed': [value: boolean | undefined]
    'open-filter': []
    export: []
  }>()

  const keyword = computed({
    get: () => props.keyword,
    set: v => emit('update:keyword', v),
  })

  type QuickFilter = { value: boolean | undefined; label: string }
  const quickFilters: QuickFilter[] = [
    { value: undefined, label: 'Semua' },
    { value: false, label: 'Belum Digunakan' },
    { value: true, label: 'Sudah Digunakan' },
  ]

  const isActive = (value: boolean | undefined) => props.claimed === value
</script>

<template>
  <div class="flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center">
    <SearchInput
      v-model="keyword"
      placeholder="Cari nama, kode tiket..."
      size="sm"
      class="lg:w-80"
      :disabled="disabled"
    />

    <div class="flex flex-wrap items-center gap-1.5">
      <button
        v-for="qf in quickFilters"
        :key="String(qf.value)"
        type="button"
        :disabled="disabled"
        :class="[
          'body-caption inline-flex items-center rounded-full border px-3 py-1.5 font-semibold transition',
          isActive(qf.value)
            ? 'bg-primary-600 border-primary-600 text-white shadow-xs'
            : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50',
          'disabled:cursor-not-allowed disabled:opacity-50',
        ]"
        @click="emit('update:claimed', qf.value)"
      >
        {{ qf.label }}
      </button>
    </div>

    <div class="lg:flex-1" />

    <div class="flex items-center gap-2">
      <Button variant="secondary" size="md" :disabled="disabled" @click="emit('open-filter')">
        <FilterIcon class="size-4" />
        Filter
        <Badge
          v-if="activeFilterCount && activeFilterCount > 0"
          variant="primary-soft"
          class="ml-1"
        >
          {{ activeFilterCount }}
        </Badge>
      </Button>

      <Button
        variant="primary"
        size="md"
        :loading="exporting"
        :disabled="disabled"
        @click="emit('export')"
      >
        <Download class="size-4" />
        Export
      </Button>
    </div>
  </div>
</template>
