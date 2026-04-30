<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { ref, computed } from 'vue'
  import { cn } from '@/utils/cn'
  import { Input } from '@/components/ui/input'
  import { Button } from '@/components/ui/button'
  import EllipseGlowSm from '@/assets/vectors/ellipse-glow-sm.png'
  import LightningGlowLg from '@/assets/vectors/lightning-glow-lg.png'

  export interface VoucherInputCardProps {
    /** Card title */
    title?: string
    /** Card description */
    description?: string
    /** Input placeholder text */
    placeholder?: string
    /** Button label */
    buttonLabel?: string
    /** Current voucher code value (v-model) */
    modelValue?: string
    /** Whether the input is disabled */
    disabled?: boolean
    /** Whether the card is in loading state */
    loading?: boolean
    /** Additional CSS classes */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<VoucherInputCardProps>(), {
    title: 'Masukkan Kode Voucher',
    description: 'Biar makin hemat masukkan atau pilih voucher yang Anda miliki',
    placeholder: 'Masukkan kode voucher',
    buttonLabel: 'Pakai',
    modelValue: '',
    disabled: false,
    loading: false,
  })

  const emit = defineEmits<{
    /** Emitted when voucher code changes */
    'update:modelValue': [value: string]
    /** Emitted when apply button is clicked */
    apply: [code: string]
  }>()

  const internalValue = ref(props.modelValue)

  const voucherCode = computed({
    get: () => props.modelValue || internalValue.value,
    set: (value: string) => {
      internalValue.value = value
      emit('update:modelValue', value)
    },
  })

  const isButtonDisabled = computed(() => {
    return props.disabled || props.loading || !voucherCode.value.trim()
  })

  const handleApply = () => {
    if (!isButtonDisabled.value) {
      emit('apply', voucherCode.value.trim())
    }
  }
</script>

<template>
  <div
    data-slot="voucher-input-card"
    :class="cn('relative flex w-full flex-col gap-4 overflow-hidden rounded-sm p-3', props.class)"
  >
    <!-- Background Gradient (dark to light, inverted) -->
    <div
      class="pointer-events-none absolute inset-0 z-0"
      :style="{
        background: 'linear-gradient(180deg, #0A2535 0%, #0D3045 35%, #103A52 65%, #14455E 100%)',
      }"
      aria-hidden="true"
    />

    <!-- Lightning Glow Decoration -->
    <img
      :src="LightningGlowLg"
      alt=""
      class="pointer-events-none absolute -right-35 -bottom-20"
      aria-hidden="true"
    />

    <!-- Ellipse Glow Decoration -->
    <img
      :src="EllipseGlowSm"
      alt=""
      class="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
      aria-hidden="true"
    />

    <!-- Content -->
    <div class="relative z-10 flex flex-col gap-3">
      <!-- Text Content -->
      <div class="flex flex-col gap-1">
        <h3 class="body-l-medium text-white">
          {{ title }}
        </h3>
        <p class="body-caption text-white/90">
          {{ description }}
        </p>
      </div>

      <!-- Input & Button Row -->
      <div class="flex items-center gap-2.5">
        <!-- Input Field -->
        <Input v-model="voucherCode" :placeholder="placeholder" :disabled="disabled" />

        <!-- Apply Button -->
        <Button size="xs" :disabled="isButtonDisabled" :loading="loading" @click="handleApply">
          {{ buttonLabel }}
        </Button>
      </div>
    </div>
  </div>
</template>
