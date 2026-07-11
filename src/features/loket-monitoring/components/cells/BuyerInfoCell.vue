<script setup lang="ts">
  import { computed } from 'vue'
  import { Mail, Phone, User } from 'lucide-vue-next'
  import { parseBuyer } from '../../utils/parseBuyer'

  const props = defineProps<{ value?: unknown }>()
  // Memoize parse so we don't re-run 6× per template render.
  const buyer = computed(() => parseBuyer(props.value))
</script>

<template>
  <div class="flex min-w-0 flex-col gap-0.5">
    <template v-if="buyer.fullname">
      <span class="body-m-medium inline-flex items-center gap-1.5 truncate text-neutral-950">
        <User class="size-3.5 shrink-0 text-neutral-500" />
        {{ buyer.fullname }}
      </span>
      <span
        v-if="buyer.phoneNumber"
        class="body-caption inline-flex items-center gap-1.5 truncate text-neutral-600 tabular-nums"
      >
        <Phone class="size-3 shrink-0 text-neutral-400" />
        {{ buyer.phoneNumber }}
      </span>
      <span
        v-if="buyer.email"
        class="body-caption inline-flex items-center gap-1.5 truncate text-neutral-600"
        :title="buyer.email"
      >
        <Mail class="size-3 shrink-0 text-neutral-400" />
        {{ buyer.email }}
      </span>
    </template>
    <span v-else class="body-m text-neutral-400">—</span>
  </div>
</template>
