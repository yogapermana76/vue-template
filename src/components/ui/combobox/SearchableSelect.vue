<script setup lang="ts" generic="T extends string | number | Record<string, unknown>">
  import type { HTMLAttributes } from 'vue'
  import type { ComboboxOption, ComboboxGroup } from './types'
  import { computed } from 'vue'
  import { Check } from 'lucide-vue-next'
  import { cn } from '@/utils/cn'
  import { Badge } from '@/components/ui/badge'
  import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
  } from '@/components/ui/command'

  export interface SearchableSelectProps<T> {
    /** v-model value */
    modelValue?: T
    /** Array of options (required if groups is not provided) */
    options?: ComboboxOption<T>[]
    /** Grouped options (alternative to options) */
    groups?: ComboboxGroup<T>[]
    /** Search input placeholder text */
    searchPlaceholder?: string
    /** Empty state text */
    emptyText?: string
    /** Disabled state */
    disabled?: boolean
    /** Hide search input field */
    hideSearch?: boolean
    /** Custom class for the popover content */
    contentClass?: HTMLAttributes['class']
    /** Popover side positioning */
    side?: 'top' | 'right' | 'bottom' | 'left'
    /** Popover alignment */
    align?: 'start' | 'center' | 'end'
  }

  const props = withDefaults(defineProps<SearchableSelectProps<T>>(), {
    options: () => [],
    searchPlaceholder: 'Cari...',
    emptyText: 'Tidak ada hasil ditemukan.',
    disabled: false,
    hideSearch: false,
    side: 'bottom',
    align: 'start',
  })

  const emit = defineEmits<{
    'update:modelValue': [value: T]
  }>()

  const open = defineModel<boolean>('open', { default: false })

  const allOptions = computed(() => {
    if (props.groups && props.groups.length > 0) {
      return props.groups.flatMap(g => g.options)
    }
    return props.options
  })

  const selectedOption = computed(() => {
    return allOptions.value.find(opt => opt.value === props.modelValue)
  })

  const handleSelect = (value: T) => {
    emit('update:modelValue', value)
    open.value = false
  }
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child :disabled="disabled">
      <!-- Trigger slot: provides open state and selected option -->
      <slot name="trigger" :open="open" :selected-option="selectedOption" :disabled="disabled" />
    </PopoverTrigger>

    <PopoverContent
      :side="side"
      :align="align"
      :class="cn('w-(--reka-popover-trigger-width) rounded-sm p-0', contentClass)"
    >
      <Command>
        <CommandInput v-if="!hideSearch" :placeholder="searchPlaceholder" />
        <CommandList>
          <CommandEmpty>{{ emptyText }}</CommandEmpty>

          <!-- Grouped options -->
          <template v-if="groups && groups.length > 0">
            <template v-for="(group, groupIndex) in groups" :key="group.id">
              <CommandSeparator v-if="groupIndex > 0" />
              <CommandGroup :heading="group.label">
                <CommandItem
                  v-for="option in group.options"
                  :key="String(option.value)"
                  :value="option.label"
                  :disabled="option.disabled"
                  @select="handleSelect(option.value)"
                >
                  <slot name="option" :option="option">
                    <div class="flex w-full items-center gap-2">
                      <span class="flex-1 truncate">{{ option.label }}</span>
                      <Badge
                        v-if="option.badge"
                        :variant="option.badge.variant || 'neutral'"
                        class="shrink-0"
                      >
                        {{ option.badge.label }}
                      </Badge>
                    </div>
                    <p v-if="option.description" class="text-muted-foreground truncate text-xs">
                      {{ option.description }}
                    </p>
                  </slot>
                  <Check
                    :class="
                      cn(
                        'ml-auto size-4 shrink-0',
                        modelValue === option.value ? 'opacity-100' : 'opacity-0',
                      )
                    "
                  />
                </CommandItem>
              </CommandGroup>
            </template>
          </template>

          <!-- Flat options -->
          <template v-else>
            <CommandGroup>
              <CommandItem
                v-for="option in options"
                :key="String(option.value)"
                :value="option.label"
                :disabled="option.disabled"
                @select="handleSelect(option.value)"
              >
                <slot name="option" :option="option">
                  <div class="flex w-full items-center gap-2">
                    <span class="flex-1 truncate">{{ option.label }}</span>
                    <Badge
                      v-if="option.badge"
                      :variant="option.badge.variant || 'neutral'"
                      class="shrink-0"
                    >
                      {{ option.badge.label }}
                    </Badge>
                  </div>
                  <p v-if="option.description" class="text-muted-foreground truncate text-xs">
                    {{ option.description }}
                  </p>
                </slot>
                <Check
                  :class="
                    cn(
                      'ml-auto size-4 shrink-0',
                      modelValue === option.value ? 'opacity-100' : 'opacity-0',
                    )
                  "
                />
              </CommandItem>
            </CommandGroup>
          </template>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
