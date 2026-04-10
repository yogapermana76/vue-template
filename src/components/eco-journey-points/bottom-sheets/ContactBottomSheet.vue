<script setup lang="ts">
  import { Mail, Headphones } from 'lucide-vue-next'
  import { BottomSheet } from '@/components/ui/bottom-sheet'
  import { ActionItem } from '@/components/ui'

  interface Props {
    open: boolean
    email?: string
    phoneNumber?: string
  }

  interface Emits {
    (e: 'update:open', value: boolean): void
    (e: 'email'): void
    (e: 'call'): void
  }

  const props = withDefaults(defineProps<Props>(), {
    email: 'xxx@gmail.co.id',
    phoneNumber: '+62...........',
  })

  const emit = defineEmits<Emits>()

  const handleEmailClick = () => {
    emit('email')
    emit('update:open', false)
  }

  const handleCallClick = () => {
    emit('call')
    emit('update:open', false)
  }

  const handleOpenChange = (value: boolean) => {
    emit('update:open', value)
  }

  const contactOptions = [
    {
      id: 'email',
      icon: Mail,
      title: 'Email',
      subtitle: `Mengirim email ke: ${props.email}`,
      action: handleEmailClick,
    },
    {
      id: 'call',
      icon: Headphones,
      title: 'Call center',
      subtitle: `Hubungi call center ${props.phoneNumber}`,
      action: handleCallClick,
    },
  ]
</script>

<template>
  <BottomSheet
    :show-close="false"
    :open="open"
    @update:open="handleOpenChange"
    content-slot-class="px-0!"
  >
    <div class="flex flex-col gap-3">
      <!-- Header -->
      <h3 class="body-l-semibold px-4 text-slate-950">Hubungi Kami</h3>

      <!-- Contact Options -->
      <div class="flex flex-col">
        <ActionItem
          v-for="option in contactOptions"
          :key="option.id"
          :icon="option.icon"
          :title="option.title"
          :subtitle="option.subtitle"
          @click="option.action"
        />
      </div>
    </div>
  </BottomSheet>
</template>
