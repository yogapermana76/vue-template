<script setup lang="ts">
  /**
   * Detail dialog with the "card-in-canvas" pattern.
   *
   *   ┌──────────────────────────────────────┐
   *   │  Title · Detail                    ✕ │  ← DialogWrapper header (canvas)
   *   │  ┌────────────────────────────────┐  │
   *   │  │ [avatar] Name              🟢  │  │  ← hero band (gradient)
   *   │  │          subtitle              │  │
   *   │  ├────────────────────────────────┤  │
   *   │  │ SECTION HEADER ────────         │  │  ← DetailSection slot
   *   │  │ Field: value   Field: value    │  │
   *   │  │ …                              │  │
   *   │  └────────────────────────────────┘  │
   *   │  [Delete]  [Edit]                    │  ← footer
   *   └──────────────────────────────────────┘
   *
   * The inner Card is the "sheet" surface. Consumers plug in:
   *   - #hero for the avatar / title / status band (or provide title/subtitle/avatarText for default)
   *   - default slot for DetailSection blocks
   *   - #footer for actions
   */
  import { computed } from 'vue'
  import { Card } from '@/components/ui/card'
  import DialogWrapper from './DialogWrapper.vue'

  type Size = 'sm' | 'md' | 'lg' | 'xl' | 'full'

  const props = withDefaults(
    defineProps<{
      open: boolean
      /** Dialog title (top bar). Typically "Entity · Detail" */
      title: string
      size?: Size
      /** Hide the built-in hero band (consumer renders full custom via #hero) */
      hideHero?: boolean
      /** Hero band props (defaults) */
      heroTitle?: string
      heroSubtitle?: string
      /** Avatar initials (default: derived from heroTitle) */
      avatarText?: string
      avatarSrc?: string
      /** Additional class for the inner Card wrapper */
      cardClass?: string
    }>(),
    {
      size: 'lg',
      hideHero: false,
    },
  )

  const emit = defineEmits<{
    'update:open': [value: boolean]
  }>()

  const openModel = computed({
    get: () => props.open,
    set: v => emit('update:open', v),
  })

  const initials = computed(() => {
    if (props.avatarText) return props.avatarText
    if (!props.heroTitle) return '?'
    return props.heroTitle
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0]?.toUpperCase() ?? '')
      .join('')
  })
</script>

<template>
  <DialogWrapper v-model:open="openModel" :title="title" :size="size" body-class="p-4" show-footer>
    <!-- Inner card — the "sheet" surface -->
    <Card :class="['overflow-hidden p-0 shadow-sm', cardClass]">
      <!-- Hero band (avatar + title/subtitle + badges) -->
      <div
        v-if="!hideHero"
        class="from-primary-50 to-background flex items-center gap-4 border-b border-neutral-100 bg-linear-to-b px-6 py-5"
      >
        <slot name="hero">
          <div
            class="bg-primary-600 heading-s flex size-14 shrink-0 items-center justify-center rounded-md text-white"
          >
            <img
              v-if="avatarSrc"
              :src="avatarSrc"
              :alt="heroTitle"
              class="size-full rounded-md object-cover"
            />
            <span v-else>{{ initials }}</span>
          </div>

          <div class="min-w-0 flex-1">
            <h3 class="heading-s text-foreground truncate">{{ heroTitle }}</h3>
            <p v-if="heroSubtitle" class="body-caption text-muted-foreground mt-0.5 truncate">
              {{ heroSubtitle }}
            </p>
          </div>

          <div v-if="$slots.badges" class="flex shrink-0 flex-wrap items-center gap-1.5">
            <slot name="badges" />
          </div>
        </slot>
      </div>

      <!-- Section content (DetailSection blocks) -->
      <div class="flex flex-col">
        <slot />
      </div>
    </Card>

    <!-- Footer (delegated to DialogWrapper footer) -->
    <template #footer>
      <slot name="footer" />
    </template>
  </DialogWrapper>
</template>
