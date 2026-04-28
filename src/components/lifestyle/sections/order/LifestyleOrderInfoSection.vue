<script setup lang="ts">
  import { computed } from 'vue'
  import { Switch } from '@/components/ui/switch'
  import { AlertBox } from '@/components/ui/alert'
  import { ContactInfoItem } from '@/components/lifestyle/cards/contact-info-item'
  import { authStorage } from '@/utils/storage/auth'

  export interface VisitorInfo {
    id: string
    name: string
    email: string
    phone: string
    type: 'Dewasa' | 'Anak-Anak'
  }

  interface UserData {
    name: string
    email: string
    phone?: string
  }

  export interface LifestyleOrderInfoSectionProps {
    /** Whether user is set as first visitor */
    isFirstVisitor: boolean
    /** List of visitors */
    visitors: VisitorInfo[]
  }

  const props = defineProps<LifestyleOrderInfoSectionProps>()

  const emit = defineEmits<{
    'update:isFirstVisitor': [value: boolean]
    'update:visitors': [visitors: VisitorInfo[]]
    'visitor-edit': [visitorId: string]
  }>()

  // Get user data from session storage
  const userData = computed(() => authStorage.getUser<UserData>())

  // Helper functions
  function isVisitorEmpty(visitor: VisitorInfo): boolean {
    return !visitor.name || !visitor.email || !visitor.phone
  }

  function shouldUseUserData(index: number): boolean {
    return index === 0 && props.isFirstVisitor
  }

  function getVisitorDisplayName(
    visitor: VisitorInfo,
    index: number,
    user: UserData | null,
  ): string {
    // Check if should use user data FIRST (priority)
    if (shouldUseUserData(index) && user?.name) {
      return user.name
    }
    // Then check if visitor is empty
    if (isVisitorEmpty(visitor)) {
      return `Isi Data Pengunjung ${index + 1}`
    }
    return visitor.name
  }

  function getVisitorDisplayEmail(
    visitor: VisitorInfo,
    index: number,
    user: UserData | null,
  ): string | undefined {
    // Check if should use user data FIRST (priority)
    if (shouldUseUserData(index) && user?.email) {
      return user.email
    }
    // Then check if visitor is empty
    if (isVisitorEmpty(visitor)) {
      return undefined
    }
    return visitor.email
  }

  // Computed properties
  const loginMessage = computed(() => {
    const user = userData.value
    return user?.name ? `Anda login sebagai ${user.name}` : 'Anda login sebagai Tamu'
  })

  const displayVisitors = computed(() => {
    const user = userData.value
    return props.visitors.map((visitor, index) => {
      const isEmpty = isVisitorEmpty(visitor)
      const useUserData = shouldUseUserData(index) && user?.name && user?.email

      return {
        ...visitor,
        isEmpty: isEmpty && !useUserData, // Not empty if using user data
        displayName: getVisitorDisplayName(visitor, index, user),
        displayEmail: getVisitorDisplayEmail(visitor, index, user),
        displayPhone: useUserData
          ? user?.phone || visitor.phone
          : isEmpty
            ? undefined
            : visitor.phone,
        displayType: isEmpty && !useUserData ? undefined : visitor.type,
      }
    })
  })

  function handleToggleChange(value: boolean) {
    emit('update:isFirstVisitor', value)

    if (props.visitors.length === 0) {
      return
    }

    const updatedVisitors = [...props.visitors]

    if (value) {
      // Auto-fill first visitor when toggle is ON
      const user = userData.value

      if (user?.name && user?.email) {
        updatedVisitors[0] = {
          ...updatedVisitors[0],
          name: user.name,
          email: user.email,
          phone: user.phone || '',
        }
        emit('update:visitors', updatedVisitors)
      }
    } else {
      // Clear first visitor when toggle is OFF
      updatedVisitors[0] = {
        ...updatedVisitors[0],
        name: '',
        email: '',
        phone: '',
      }
      emit('update:visitors', updatedVisitors)
    }
  }
</script>

<template>
  <section class="flex flex-col gap-4 px-4">
    <h2 class="body-l-semibold text-slate-950">Informasi Pemesan</h2>

    <AlertBox variant="info" :icon="true">
      <span class="body-caption text-primary-800">{{ loginMessage }}</span>
    </AlertBox>

    <div class="flex items-center justify-between gap-3">
      <span class="body-m flex-1 text-slate-950">Atur sebagai pengunjung 1</span>
      <Switch
        :checked="props.isFirstVisitor"
        @update:checked="handleToggleChange"
        @click.stop="() => handleToggleChange(!props.isFirstVisitor)"
      />
    </div>

    <div class="flex flex-col gap-3">
      <h2 class="body-l-semibold text-slate-950">Informasi Pengunjung</h2>
      <div class="flex flex-col gap-3">
        <ContactInfoItem
          v-for="visitor in displayVisitors"
          :key="visitor.id"
          :name="
            visitor.isEmpty
              ? visitor.displayName
              : `${visitor.displayName} (${visitor.displayType})`
          "
          :email="visitor.displayEmail"
          :phone="visitor.displayPhone"
          :clickable="true"
          @click="$emit('visitor-edit', visitor.id)"
        />
      </div>
    </div>
  </section>
</template>
