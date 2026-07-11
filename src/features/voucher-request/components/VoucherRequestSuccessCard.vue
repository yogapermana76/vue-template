<script setup lang="ts">
  import { useClipboard } from '@vueuse/core'
  import { Check, Copy, Ticket } from 'lucide-vue-next'

  const props = defineProps<{
    requestId: string
    label?: string
  }>()

  const { copy, copied, isSupported } = useClipboard({
    source: () => props.requestId,
    copiedDuring: 1500,
  })

  const onCopy = () => {
    if (!isSupported.value) return
    copy(props.requestId)
  }
</script>

<template>
  <div
    class="from-primary-50 to-secondary-50 border-primary-100/70 relative w-full overflow-hidden rounded-md border bg-linear-to-br shadow-xs"
  >
    <!-- Ambient glow accent (decorative, non-interactive) -->
    <div
      aria-hidden="true"
      class="from-primary-200/40 pointer-events-none absolute -top-14 -right-10 size-40 rounded-full bg-radial to-transparent blur-2xl"
    />

    <div class="relative flex items-stretch">
      <div class="flex min-w-0 flex-1 flex-col gap-1.5 py-4 pl-5">
        <span
          class="text-xxs text-primary-800/70 inline-flex items-center gap-1.5 font-semibold tracking-wider uppercase"
        >
          <Ticket class="size-3" />
          {{ label ?? 'ID Pengajuan Anda' }}
        </span>
        <span
          class="text-primary-900 truncate font-mono text-2xl leading-none font-bold tracking-wider tabular-nums"
        >
          {{ requestId }}
        </span>
      </div>

      <div class="bg-primary-200/60 mx-1 my-3 w-px shrink-0" />

      <button
        v-if="isSupported"
        type="button"
        :aria-label="copied ? 'Tersalin' : 'Salin ID pengajuan'"
        class="group hover:bg-primary-100/60 active:bg-primary-100 flex shrink-0 flex-col items-center justify-center gap-1 rounded-r-xl px-4 transition"
        @click="onCopy"
      >
        <transition
          mode="out-in"
          enter-active-class="transition duration-150 ease-out"
          leave-active-class="transition duration-100 ease-in"
          enter-from-class="scale-75 opacity-0"
          leave-to-class="scale-125 opacity-0"
        >
          <Check v-if="copied" key="check" class="text-success-600 size-5" />
          <Copy v-else key="copy" class="text-primary-700 group-hover:text-primary-800 size-5" />
        </transition>
        <span
          class="text-xxs font-semibold tracking-wide"
          :class="copied ? 'text-success-700' : 'text-primary-700/80'"
        >
          {{ copied ? 'Tersalin' : 'Salin' }}
        </span>
      </button>
    </div>
  </div>
</template>
