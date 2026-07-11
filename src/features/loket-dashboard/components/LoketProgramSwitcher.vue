<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { CalendarDays, ChevronsUpDown, Ticket } from 'lucide-vue-next'
  import { SearchableSelect, type ComboboxOption } from '@/components/ui/combobox'
  import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
  import { Spinner } from '@/components/ui/spinner'
  import { formatDateRangeInTZ } from '@/utils/date'
  import type { LoketProgram } from '@/types/services/loket'

  type Variant = 'default' | 'dark' | 'compact'

  interface VariantStyle {
    button: string
    iconWrap: string
    iconClass: string
    label: string
    labelMax: string
    caption: string
    chevron: string
    spinnerTone: 'primary' | 'white' | 'muted'
    showEyebrow: boolean
    eyebrowLabel: string
    eyebrowClass: string
    showPeriod: boolean
    showTooltip: boolean
  }

  const VARIANT_STYLES: Record<Variant, VariantStyle> = {
    default: {
      button:
        'hover:border-primary-300 hover:bg-primary-50/50 group inline-flex w-full items-center gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left shadow-xs transition disabled:opacity-60 sm:w-auto sm:min-w-64 sm:max-w-sm',
      iconWrap:
        'from-primary-500 to-primary-600 text-white flex size-9 shrink-0 items-center justify-center rounded-md bg-linear-to-br shadow-inner',
      iconClass: 'size-4',
      label:
        'body-m-semibold text-neutral-950 animate-in fade-in duration-300 truncate group-hover:text-primary-800',
      labelMax: '',
      caption: 'body-caption text-neutral-500 tabular-nums inline-flex items-center gap-1 truncate',
      chevron: 'text-neutral-400 group-hover:text-primary-600 size-4 shrink-0',
      spinnerTone: 'muted',
      showEyebrow: true,
      eyebrowLabel: 'Program Aktif',
      eyebrowClass: 'text-xxs text-neutral-500 font-medium uppercase tracking-wider',
      showPeriod: true,
      showTooltip: true,
    },
    dark: {
      button:
        'group border-white/20 bg-white/10 hover:bg-white/15 hover:border-white/30 inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left backdrop-blur-sm transition disabled:opacity-60',
      iconWrap: '',
      iconClass: 'text-white size-4 shrink-0',
      label: 'body-caption text-white animate-in fade-in duration-300 truncate font-semibold',
      labelMax: 'max-w-40 sm:max-w-56',
      caption: '',
      chevron: 'text-white/70 size-3.5 shrink-0',
      spinnerTone: 'white',
      showEyebrow: true,
      eyebrowLabel: 'Ganti',
      eyebrowClass: 'text-xxs text-white/70 font-semibold uppercase tracking-wider',
      showPeriod: false,
      showTooltip: false,
    },
    compact: {
      button:
        'hover:border-primary-300 hover:bg-primary-50 group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-left shadow-xs transition disabled:opacity-60',
      iconWrap: '',
      iconClass: 'text-primary-600 size-3.5 shrink-0',
      label: 'body-caption text-neutral-950 truncate font-semibold',
      labelMax: 'max-w-40',
      caption: '',
      chevron: 'text-neutral-400 size-3.5 shrink-0',
      spinnerTone: 'primary',
      showEyebrow: false,
      eyebrowLabel: '',
      eyebrowClass: '',
      showPeriod: false,
      showTooltip: false,
    },
  }

  const props = withDefaults(
    defineProps<{
      programs: LoketProgram[]
      modelValue?: number
      loading?: boolean
      variant?: Variant
    }>(),
    { variant: 'default' },
  )

  const emit = defineEmits<{
    'update:modelValue': [value: number | undefined]
  }>()

  const open = ref(false)
  const styles = computed(() => VARIANT_STYLES[props.variant])

  const selected = computed(() => props.programs.find(p => p.ID === props.modelValue))
  const displayTitle = computed(
    () => selected.value?.Name || selected.value?.Title || 'Pilih program',
  )

  // No per-record Timezone on LoketProgram — falls back to Asia/Jakarta default.
  const formatPeriod = (p: LoketProgram): string | null =>
    formatDateRangeInTZ(p.StartDate, p.EndDate, null, { collapseSameYear: true }) || null

  const periodShort = computed(() => (selected.value ? formatPeriod(selected.value) : null))

  const options = computed<ComboboxOption<number>[]>(() =>
    props.programs.map(p => ({
      value: p.ID,
      label: p.Name || p.Title || `Program ${p.ID}`,
      description: formatPeriod(p) ?? undefined,
    })),
  )

  const shouldRender = computed(() => props.loading || props.programs.length > 1)

  const onSelect = (value: number) => emit('update:modelValue', value)
</script>

<template>
  <TooltipProvider v-if="shouldRender">
    <SearchableSelect
      v-model:open="open"
      :model-value="modelValue"
      :options="options"
      :disabled="loading"
      search-placeholder="Cari program..."
      empty-text="Program tidak ditemukan"
      align="end"
      content-class="w-96 max-w-[calc(100vw-2rem)]"
      @update:model-value="onSelect"
    >
      <template #trigger>
        <button type="button" :disabled="loading" :class="styles.button">
          <span v-if="styles.iconWrap" :class="styles.iconWrap">
            <Ticket :class="styles.iconClass" />
          </span>
          <Ticket v-else :class="styles.iconClass" />

          <div class="flex min-w-0 flex-1 flex-col leading-tight">
            <span v-if="styles.showEyebrow" :class="styles.eyebrowClass">
              {{ styles.eyebrowLabel }}
            </span>

            <Spinner v-if="loading" size="xs" :tone="styles.spinnerTone" class="mt-0.5" />

            <template v-else>
              <Tooltip v-if="styles.showTooltip" :delay-duration="300">
                <TooltipTrigger as-child>
                  <span :class="[styles.label, styles.labelMax]">{{ displayTitle }}</span>
                </TooltipTrigger>
                <TooltipContent side="bottom" class="max-w-xs">
                  <p class="body-caption font-semibold">{{ displayTitle }}</p>
                  <p v-if="periodShort" class="body-caption mt-0.5 text-neutral-300">
                    {{ periodShort }}
                  </p>
                </TooltipContent>
              </Tooltip>
              <span v-else :class="[styles.label, styles.labelMax]">{{ displayTitle }}</span>

              <span v-if="styles.showPeriod && periodShort" :class="styles.caption">
                <CalendarDays class="size-3 shrink-0" />
                {{ periodShort }}
              </span>
            </template>
          </div>

          <ChevronsUpDown :class="styles.chevron" />
        </button>
      </template>

      <template #option="{ option }">
        <div class="flex min-w-0 flex-1 flex-col leading-tight">
          <span class="body-m-semibold truncate text-neutral-950">{{ option.label }}</span>
          <span
            v-if="option.description"
            class="body-caption truncate text-neutral-500 tabular-nums"
          >
            {{ option.description }}
          </span>
        </div>
      </template>
    </SearchableSelect>
  </TooltipProvider>
</template>
