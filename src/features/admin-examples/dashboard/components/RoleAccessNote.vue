<script setup lang="ts">
  import { Card, CardContent } from '@/components/ui/card'
  import type { RoleAccess } from '../types'

  defineProps<{
    roles: RoleAccess[]
  }>()
</script>

<template>
  <Card class="border-primary-200 bg-primary-50">
    <CardContent class="pt-6">
      <p class="body-m text-primary-800">
        <strong>Note:</strong> This dashboard demonstrates RBAC (Role-Based Access Control). Menu
        items are filtered based on user role.
      </p>
      <ul class="text-primary-700 body-m mt-2 list-inside list-disc">
        <li v-for="entry in roles" :key="entry.role">
          <strong>{{ entry.role }}:</strong> {{ entry.description }}
        </li>
      </ul>
    </CardContent>
  </Card>
</template>
