<script setup lang="ts">
  import { DetailField, DetailSection } from '@/components/ui/side-sheet'
  import { formatDate } from '@/utils/date'
  import { userRoleLabel } from '../constants'
  import UserStatusBadge from './UserStatusBadge.vue'
  import type { User } from '../types'

  defineProps<{
    user: User
  }>()

  const date = (v?: string) => (v ? formatDate(v, 'dd MMM yyyy') : '—')
</script>

<template>
  <div class="flex flex-col">
    <DetailSection title="Profile">
      <DetailField label="Full name" :value="user.name" />
      <DetailField label="Email" :value="user.email" />
      <DetailField label="Phone" :value="user.phone" />
      <DetailField label="Department" :value="user.department" />
    </DetailSection>

    <DetailSection title="Access">
      <DetailField label="Role" :value="userRoleLabel[user.role]" />
      <DetailField label="Status">
        <UserStatusBadge :status="user.status" />
      </DetailField>
      <DetailField label="Joined" :value="date(user.joinedAt)" />
      <DetailField label="Last login" :value="date(user.lastLoginAt)" />
    </DetailSection>
  </div>
</template>
