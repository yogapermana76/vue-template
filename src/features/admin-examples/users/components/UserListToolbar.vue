<script setup lang="ts">
  import { computed } from 'vue'
  import { SelectOption } from '@/components/ui/native-select'
  import { SearchInput } from '@/components/shared/search-input'
  import { withAllOption } from '@/utils'
  import { userRoleOptions, userStatusOptions } from '../constants'
  import type { UserStatusFilter } from '../types'

  const status = defineModel<UserStatusFilter>({ required: true })
  const role = defineModel<string>('role', { default: 'all' })
  const search = defineModel<string>('search', { default: '' })

  const statusOptions = computed(
    () =>
      withAllOption(userStatusOptions, 'All statuses') as {
        value: UserStatusFilter
        label: string
      }[],
  )
  const roleOptions = computed(() => withAllOption(userRoleOptions, 'All roles'))
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 px-4 py-3">
    <SearchInput v-model="search" size="sm" placeholder="Search users…" class="w-64 shrink-0" />

    <div class="min-w-0 flex-1" />

    <div class="w-40 shrink-0">
      <SelectOption v-model="status" :options="statusOptions" placeholder="Status" />
    </div>
    <div class="w-40 shrink-0">
      <SelectOption v-model="role" :options="roleOptions" placeholder="Role" />
    </div>
  </div>
</template>
