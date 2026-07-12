<script setup lang="ts">
  import { computed } from 'vue'
  import { Search } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { SearchInput } from '@/components/shared'
  import { SearchableSelectField } from '@/components/ui/combobox'
  import type { ComboboxOption } from '@/components/ui/combobox'
  import { SUBMISSION_CATEGORY_OPTIONS } from '../../constants'
  import type { SubmissionStatus } from '../../types'
  import SubmissionStatusTabs from '../tabs/SubmissionStatusTabs.vue'

  const props = defineProps<{
    activeStatus: SubmissionStatus
    statusOrder: readonly SubmissionStatus[]
    statusCounts: Record<SubmissionStatus, number>
    keyword: string
    category: string | null
    showBulkActions?: boolean
    bulkDisabled?: boolean
  }>()

  const emit = defineEmits<{
    'update:activeStatus': [value: SubmissionStatus]
    'update:keyword': [value: string]
    'update:category': [value: string | null]
    'approve-selected': []
    'reject-selected': []
  }>()

  const keywordModel = computed({
    get: () => props.keyword,
    set: v => emit('update:keyword', v),
  })

  const categoryModel = computed<string | undefined>({
    get: () => props.category ?? undefined,
    set: v => emit('update:category', v ?? null),
  })

  const categoryOptions = computed<ComboboxOption<string>[]>(() =>
    SUBMISSION_CATEGORY_OPTIONS.map(o => ({ value: o.value, label: o.label })),
  )
</script>

<template>
  <div class="flex flex-col">
    <!-- Row 1: tabs anchor. -->
    <div class="px-4 pt-3">
      <SubmissionStatusTabs
        :model-value="activeStatus"
        :order="statusOrder"
        :counts="statusCounts"
        @update:model-value="v => emit('update:activeStatus', v)"
      />
    </div>

    <!-- Row 2: search + inline filters (left) + bulk actions (right). -->
    <div class="flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center">
      <div class="flex flex-1 flex-wrap items-center gap-2">
        <SearchInput
          v-model="keywordModel"
          placeholder="Cari nomor, nama atau NIK disini"
          size="sm"
          :prefix-icon="Search"
          class="lg:w-72"
        />
        <SearchableSelectField
          v-model="categoryModel"
          :options="categoryOptions"
          placeholder="Pilih Kategori"
          search-placeholder="Cari kategori..."
          empty-text="Kategori tidak ditemukan"
          clearable
          class="lg:w-44"
        />
      </div>

      <div v-if="showBulkActions" class="flex items-center gap-2">
        <Button
          variant="secondary"
          size="md"
          :disabled="bulkDisabled"
          @click="emit('reject-selected')"
        >
          Tolak Semua
        </Button>
        <Button
          variant="primary"
          size="md"
          :disabled="bulkDisabled"
          @click="emit('approve-selected')"
        >
          Setujui Semua
        </Button>
      </div>
    </div>
  </div>
</template>
