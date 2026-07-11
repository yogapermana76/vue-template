<script setup lang="ts">
  import type { HTMLAttributes, Component } from 'vue'
  import { cn } from '@/utils/cn'

  const props = withDefaults(
    defineProps<{
      class?: HTMLAttributes['class']
      title?: string
      titleClass?: HTMLAttributes['class']
      description?: string
      descriptionClass?: HTMLAttributes['class']
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

      <div v-if="title || description" class="flex flex-col items-center gap-2">
        <h3
          v-if="title"
          :class="cn('text-center text-lg leading-7 font-semibold text-neutral-950', titleClass)"
        >
          {{ title }}
        </h3>
        <p
          v-if="description"
          :class="
            cn(
              'text-center text-sm leading-5 font-normal whitespace-pre-line text-neutral-700',
              descriptionClass,
            )
          "
        >
          {{ description }}
        </p>
      </div>
    </div>

    <slot />

    <div v-if="$slots.actions" class="flex w-full flex-col gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>
