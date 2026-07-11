<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { X } from 'lucide-vue-next'
  import { BottomSheet } from '@/components/ui/bottom-sheet'
  import { Button } from '@/components/ui/button'
  import { Input, InputGroup } from '@/components/ui/input'

  // BottomSheet (not a dialog) so the input stays visible above the mobile keyboard.
  const props = defineProps<{ open: boolean }>()

  const emit = defineEmits<{
    'update:open': [value: boolean]
    submit: [code: string]
  }>()

  const code = ref('')

  // Clear input on close so the next open starts fresh.
  watch(
    () => props.open,
    isOpen => {
      if (!isOpen) code.value = ''
    },
  )

  const submit = () => {
    const trimmed = code.value.trim()
    if (!trimmed) return
    emit('submit', trimmed.toUpperCase())
    emit('update:open', false)
  }
</script>

<template>
  <BottomSheet
    :open="open"
    title="Input Kode Manual"
    description="Ketik kode tiket jika QR tidak terbaca."
    nested
    has-footer
    @update:open="v => emit('update:open', v)"
  >
    <form class="py-4" @submit.prevent="submit">
      <InputGroup>
        <Input
          v-model="code"
          placeholder="Contoh: TKT-1-000123"
          class="h-12 font-mono tracking-wider uppercase"
          autocomplete="off"
          autofocus
        />
      </InputGroup>
    </form>

    <template #footer>
      <div class="flex w-full gap-2">
        <Button variant="secondary" size="lg" class="flex-1" @click="emit('update:open', false)">
          <X class="size-4" />
          Batal
        </Button>
        <Button variant="primary" size="lg" class="flex-1" :disabled="!code.trim()" @click="submit">
          Verifikasi
        </Button>
      </div>
    </template>
  </BottomSheet>
</template>
