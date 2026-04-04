<script setup lang="ts">
  import type { HTMLAttributes, Component } from 'vue'
  import { cn } from '@/utils/cn'

  const props = withDefaults(
    defineProps<{
      class?: HTMLAttributes['class']
      title?: string
      description?: string
      image?: string | Component
      imageSize?: 'sm' | 'md' | 'lg'
    }>(),
    {
      imageSize: 'md',
    },
  )

  const imageSizeClasses = {
    sm: 'size-32',
    md: 'size-40',
    lg: 'size-56',
  }
</script>

<template>
  <div
    data-slot="empty-state"
    :class="cn('flex w-full flex-col items-center justify-center gap-6', props.class)"
  >
    <!-- Asset & Content -->
    <div class="flex flex-col items-center gap-3">
      <!-- Image/Illustration -->
      <div
        v-if="image || $slots.image"
        :class="cn('flex items-center justify-center', imageSizeClasses[imageSize])"
      >
        <slot name="image">
          <component
            :is="image"
            v-if="typeof image !== 'string' && image"
            class="size-full object-contain"
          />
          <img
            v-else-if="typeof image === 'string'"
            :src="image"
            alt=""
            class="size-full object-contain"
          />
        </slot>
      </div>

      <!-- Text Content -->
      <div
        v-if="title || description || $slots.default"
        class="flex max-w-xs flex-col items-center gap-2"
      >
        <h3 v-if="title" class="text-center text-lg leading-7 font-semibold text-neutral-950">
          {{ title }}
        </h3>
        <p v-if="description" class="text-center text-sm leading-5 font-normal text-neutral-700">
          {{ description }}
        </p>
        <slot />
      </div>
    </div>

    <!-- Actions -->
    <div v-if="$slots.actions" class="flex w-full max-w-xs flex-col gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>
