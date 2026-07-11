<script setup lang="ts">
  import { ref } from 'vue'
  import { KeyRound, SendHorizontal } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { InputGroup, Input } from '@/components/ui/input'

  const props = defineProps<{
    disabled?: boolean
    loading?: boolean
  }>()

  const emit = defineEmits<{
    submit: [code: string]
  }>()

  const code = ref('')

  const onSubmit = () => {
    const value = code.value.trim()
    if (!value) return
    emit('submit', value)
    code.value = ''
  }
</script>

<template>
  <form
    class="flex flex-col gap-3 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-4"
    @submit.prevent="onSubmit"
  >
    <div class="flex items-start gap-2.5">
      <span
        class="bg-primary-100 text-primary-700 flex size-8 shrink-0 items-center justify-center rounded-lg"
      >
        <KeyRound class="size-4" />
      </span>
      <div class="flex flex-col">
        <p class="body-m-semibold text-neutral-950">Input Kode Manual</p>
        <p class="body-caption text-neutral-600">
          Ketik kode tiket jika QR tidak terbaca atau kamera tidak tersedia.
        </p>
      </div>
    </div>

    <div class="flex gap-2">
      <InputGroup class="flex-1">
        <Input
          v-model="code"
          placeholder="Contoh: TKT-2026-000123"
          class="h-11 font-mono tracking-wider uppercase"
          :disabled="props.disabled || props.loading"
          autocomplete="off"
          @keydown.enter.prevent="onSubmit"
        />
      </InputGroup>
      <Button
        type="submit"
        variant="primary"
        size="md"
        :loading="props.loading"
        :disabled="props.disabled || !code.trim()"
      >
        <SendHorizontal class="size-4" />
        Verifikasi
      </Button>
    </div>
  </form>
</template>
