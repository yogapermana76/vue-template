<script setup lang="ts">
  import { ref } from 'vue'
  import { Eye, EyeOff } from 'lucide-vue-next'
  import { TextField, type TextFieldProps } from '.'

  type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'suffixIcon'>

  const props = withDefaults(defineProps<PasswordFieldProps>(), {
    placeholder: 'Masukkan password',
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string | number]
    blur: [event: FocusEvent]
  }>()

  const showPassword = ref(false)
</script>

<template>
  <TextField
    v-bind="props"
    :type="showPassword ? 'text' : 'password'"
    @update:model-value="emit('update:modelValue', $event)"
    @blur="emit('blur', $event)"
  >
    <template #suffix>
      <button
        type="button"
        tabindex="-1"
        class="text-neutral-400 transition-colors hover:text-neutral-600"
        @click="showPassword = !showPassword"
      >
        <component :is="showPassword ? EyeOff : Eye" class="size-4" />
      </button>
    </template>

    <!-- Forward footerRight slot so consumers can inject e.g. a "Forgot password?" link -->
    <template v-if="$slots.footerRight" #footerRight>
      <slot name="footerRight" />
    </template>
  </TextField>
</template>
