<script setup lang="ts">
  import { computed } from 'vue'
  import { scorePassword, strengthLabels, strengthTones } from '../constants'

  const props = defineProps<{
    password: string
  }>()

  const score = computed(() => scorePassword(props.password))
  const label = computed(() => strengthLabels[score.value])
  const tone = computed(() => strengthTones[score.value])
</script>

<template>
  <div v-if="password" class="flex flex-col gap-1.5">
    <div class="flex gap-1">
      <div
        v-for="i in 4"
        :key="i"
        :class="[
          'h-1 flex-1 rounded-full transition-colors duration-200',
          score >= i ? tone.split(' ')[0] : 'bg-neutral-200',
        ]"
      />
    </div>
    <p class="body-caption">
      <span class="text-neutral-500">Strength:</span>
      <span :class="['ml-1', tone.split(' ')[1]]">{{ label }}</span>
    </p>
  </div>
</template>
