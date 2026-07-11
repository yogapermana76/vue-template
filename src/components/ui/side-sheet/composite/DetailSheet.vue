<script lang="ts" setup>
  import { computed } from 'vue'
  import RightSheet from '../RightSheet.vue'
  import SheetHeader from '../SheetHeader.vue'

  interface Props {
    open?: boolean
    dismissible?: boolean
    /** Main title (e.g. entity name) */
    title?: string
    /** Sub label (e.g. SKU / ID) */
    subtitle?: string
    /** Avatar text (initials). If not provided, computed from title. */
    avatarText?: string
    /** Avatar image URL */
    avatarSrc?: string
    /** Width preset */
    width?: 'sm' | 'md' | 'lg' | 'xl'
    /** Show close button in header */
    showClose?: boolean
    /** Show footer bar */
    hasFooter?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    open: false,
    dismissible: true,
    width: 'md',
    showClose: true,
    hasFooter: false,
  })

  const emit = defineEmits<{
    'update:open': [value: boolean]
  }>()

  const isOpen = computed({
    get: () => props.open,
    set: v => emit('update:open', v),
  })

  const initials = computed(() => {
    if (props.avatarText) return props.avatarText
    if (!props.title) return '?'
    return props.title
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0]?.toUpperCase() ?? '')
      .join('')
  })

  const closeSheet = () => (isOpen.value = false)
</script>

<template>
  <RightSheet
    v-model:open="isOpen"
    :dismissible="dismissible"
    :width="width"
    hide-header
    :has-footer="hasFooter"
    content-slot-class="!p-0"
  >
    <template v-if="$slots.trigger" #trigger>
      <slot name="trigger" />
    </template>

    <!-- Custom hero header: gradient band + avatar + badges -->
    <template #header>
      <SheetHeader variant="hero" :show-close="showClose" @close="closeSheet">
        <div class="flex items-start gap-4 pr-8">
          <div
            class="bg-primary-600 heading-s flex size-14 shrink-0 items-center justify-center rounded-md text-white"
          >
            <img
              v-if="avatarSrc"
              :src="avatarSrc"
              :alt="title"
              class="size-full rounded-md object-cover"
            />
            <span v-else>{{ initials }}</span>
          </div>

          <div class="min-w-0 flex-1">
            <h2 class="heading-s text-foreground truncate">{{ title }}</h2>
            <p v-if="subtitle" class="body-caption text-muted-foreground mt-1 truncate">
              {{ subtitle }}
            </p>

            <div v-if="$slots.badges" class="mt-2.5 flex flex-wrap items-center gap-1.5">
              <slot name="badges" />
            </div>
          </div>
        </div>
      </SheetHeader>
    </template>

    <!-- Sections -->
    <div class="flex flex-col">
      <slot />
    </div>

    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </RightSheet>
</template>
