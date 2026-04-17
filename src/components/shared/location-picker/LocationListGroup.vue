<script setup lang="ts" generic="T extends LocationItem">
  import { RadioGroup, RadioGroupItemLabel } from '@/components/ui/radio-group'
  import type { LocationItem, LocationGroup } from './types'

  interface Props {
    /** Grouped location data */
    groups: LocationGroup<T>[]
    /** Currently selected item ID */
    selectedId?: string
  }

  defineProps<Props>()

  const emit = defineEmits<{
    select: [id: string]
  }>()

  const handleSelect = (value: string | number) => {
    emit('select', String(value))
  }
</script>

<template>
  <!-- Alphabetically Grouped List -->
  <div v-for="group in groups" :key="group.letter" class="mb-6">
    <!-- Letter Header -->
    <div class="mb-3 flex items-center gap-3">
      <span class="body-l-semibold text-neutral-500">{{ group.letter }}</span>
      <div class="h-px flex-1 bg-neutral-200" />
    </div>

    <!-- Items -->
    <RadioGroup :model-value="selectedId" class="flex flex-col gap-2 pl-4">
      <RadioGroupItemLabel
        v-for="item in group.items"
        :key="item.id"
        :value="item.id"
        :label="item.name"
        :selected="selectedId === item.id"
        @click="handleSelect"
      />
    </RadioGroup>
  </div>
</template>
