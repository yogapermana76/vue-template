<script setup lang="ts">
  import { computed } from 'vue'
  import { SelectOption } from '@/components/ui/native-select'
  import { SearchInput } from '@/components/shared/search-input'
  import { withAllOption } from '@/utils'
  import { productCategoryOptions, productStatusOptions } from '../constants'
  import type { ProductStatusFilter } from '../types'

  const status = defineModel<ProductStatusFilter>({ required: true })
  const category = defineModel<string>('category', { default: 'all' })
  const search = defineModel<string>('search', { default: '' })

  const statusOptions = computed(
    () =>
      withAllOption(productStatusOptions, 'All statuses') as {
        value: ProductStatusFilter
        label: string
      }[],
  )
  const categoryOptions = computed(() => withAllOption(productCategoryOptions, 'All categories'))
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 px-4 py-3">
    <SearchInput v-model="search" size="sm" placeholder="Search products…" class="w-64 shrink-0" />

    <div class="min-w-0 flex-1" />

    <div class="w-40 shrink-0">
      <SelectOption v-model="status" :options="statusOptions" placeholder="Status" />
    </div>
    <div class="w-44 shrink-0">
      <SelectOption v-model="category" :options="categoryOptions" placeholder="Category" />
    </div>
  </div>
</template>
