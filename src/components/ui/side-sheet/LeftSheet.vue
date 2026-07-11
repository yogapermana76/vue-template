<script lang="ts" setup>
  import SideSheet from './SideSheet.vue'
  import type { SidePresetProps } from './types'

  const props = withDefaults(defineProps<SidePresetProps>(), {
    open: false,
    dismissible: true,
    showClose: true,
    showBack: false,
    headerVariant: 'tinted',
    hideHeader: false,
    width: 'md',
    contentClass: '',
    contentSlotClass: '',
    headerClass: '',
    hasFooter: false,
    footerPosition: 'sticky',
    footerClass: '',
    nested: false,
  })

  const emit = defineEmits<{
    'update:open': [value: boolean]
    back: []
  }>()
</script>

<template>
  <SideSheet
    direction="left"
    v-bind="props"
    @update:open="v => emit('update:open', v)"
    @back="emit('back')"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </SideSheet>
</template>
