<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { AlertCircle } from 'lucide-vue-next'
  import { cn } from '@/utils/cn'
  import { Button } from '@/components/ui/button'

  interface Props {
    title?: string
    message?: string
    retryLabel?: string
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<Props>(), {
    title: 'Something went wrong',
    retryLabel: 'Try Again',
  })

  const emit = defineEmits<{
    retry: []
  }>()
</script>

<template>
  <div :class="cn('py-12 text-center', props.class)">
    <AlertCircle class="text-error-500 mx-auto mb-4 size-12" />
    <h3 class="text-lg font-semibold text-neutral-800">{{ title }}</h3>
    <p v-if="message" class="text-error-600 mt-1">{{ message }}</p>
    <slot name="description" />
    <div class="mt-4 flex justify-center gap-4">
      <Button
        variant="outline"
        class="border-primary-300 text-primary-600 hover:bg-primary-50"
        @click="emit('retry')"
      >
        {{ retryLabel }}
      </Button>
      <slot name="action" />
    </div>
  </div>
</template>
