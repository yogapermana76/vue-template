<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { computed, ref } from 'vue'
  import { ChevronDown, Check } from 'lucide-vue-next'
  import { BottomSheet } from '@/components/ui/bottom-sheet'
  import { cn } from '@/utils/cn'

  export interface Country {
    code: string
    name: string
    dialCode: string
    flag?: string
  }

  const props = withDefaults(
    defineProps<{
      class?: HTMLAttributes['class']
      modelValue?: string
      countries?: Country[]
      disabled?: boolean
    }>(),
    {
      modelValue: '+62',
      disabled: false,
    },
  )

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'change', country: Country): void
  }>()

  // Default countries list
  const defaultCountries: Country[] = [
    { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
    { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
    { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
    { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭' },
    { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
    { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
    { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
    { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
    { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
    { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
    { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  ]

  const countriesList = computed(() => props.countries || defaultCountries)

  const selectedCountry = computed(() => {
    return countriesList.value.find(c => c.dialCode === props.modelValue) || countriesList.value[0]
  })

  const isOpen = ref(false)

  const openSheet = () => {
    if (!props.disabled) {
      isOpen.value = true
    }
  }

  const selectCountry = (country: Country) => {
    emit('update:modelValue', country.dialCode)
    emit('change', country)
    isOpen.value = false
  }
</script>

<template>
  <div class="relative">
    <button
      type="button"
      :disabled="disabled"
      :class="
        cn(
          'flex items-center gap-1.5 text-sm text-neutral-900',
          'hover:text-neutral-700',
          'focus:outline-none',
          disabled && 'cursor-not-allowed text-neutral-400',
          props.class,
        )
      "
      @click="openSheet"
    >
      <!-- Flag -->
      <span class="text-base leading-none">{{ selectedCountry?.flag }}</span>
      <!-- Dial Code -->
      <span>{{ selectedCountry?.dialCode }}</span>
      <!-- Chevron -->
      <ChevronDown class="size-4 text-neutral-500" />
    </button>

    <!-- Bottom Sheet -->
    <BottomSheet v-model:open="isOpen" title="Pilih Kode Negara">
      <div class="flex flex-col">
        <button
          v-for="country in countriesList"
          :key="country.code"
          type="button"
          :class="
            cn(
              'flex w-full items-center gap-3 px-1 py-3 text-left text-sm',
              'border-b border-neutral-100 last:border-b-0',
              'active:bg-neutral-50',
              country.dialCode === modelValue && 'text-primary-700',
            )
          "
          @click="selectCountry(country)"
        >
          <span class="text-xl leading-none">{{ country.flag }}</span>
          <span class="flex-1">{{ country.name }}</span>
          <span class="text-neutral-500">{{ country.dialCode }}</span>
          <Check v-if="country.dialCode === modelValue" class="text-primary-600 size-5 shrink-0" />
        </button>
      </div>
    </BottomSheet>
  </div>
</template>
