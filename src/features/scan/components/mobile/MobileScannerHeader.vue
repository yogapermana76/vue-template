<script setup lang="ts">
  import { ArrowLeft, KeyRound } from 'lucide-vue-next'
  import { IconButton } from '@/components/ui/button'
  import { ProgramSwitcher } from '@/features/dashboard'
  import type { Program } from '@/types/services'

  defineProps<{
    hasProgram: boolean
    programs?: Program[]
    programId?: number
    programsLoading?: boolean
  }>()

  defineEmits<{
    close: []
    'open-manual': []
    'update:programId': [id: number | undefined]
  }>()
</script>

<template>
  <header
    class="safe-top absolute inset-x-0 top-0 z-20 bg-linear-to-b from-black/80 to-transparent"
  >
    <div class="flex h-14 items-center gap-2 px-4 pt-1">
      <IconButton
        variant="tertiary"
        size="md"
        class="-ml-2 text-white hover:bg-white/10"
        aria-label="Tutup scanner"
        @click="$emit('close')"
      >
        <ArrowLeft />
      </IconButton>

      <div class="flex min-w-0 flex-1 justify-center">
        <ProgramSwitcher
          v-if="hasProgram"
          variant="dark"
          :programs="programs ?? []"
          :model-value="programId"
          :loading="programsLoading"
          @update:model-value="v => $emit('update:programId', v)"
        />
        <p v-else class="body-m-semibold text-white">Scan Tiket</p>
      </div>

      <IconButton
        variant="tertiary"
        size="md"
        class="-mr-2 text-white hover:bg-white/10"
        aria-label="Input kode manual"
        :disabled="!hasProgram"
        @click="$emit('open-manual')"
      >
        <KeyRound />
      </IconButton>
    </div>
  </header>
</template>
