<script setup lang="ts">
  import { computed } from 'vue'
  import { Pencil, Trash2 } from 'lucide-vue-next'
  import { Badge } from '@/components/ui/badge'
  import { Button } from '@/components/ui/button'
  import { DetailDialog } from '@/components/ui/dialog/composite'
  import { userRoleLabel } from '../constants'
  import type { User } from '../types'
  import UserAvatar from './UserAvatar.vue'
  import UserDetailPanel from './UserDetailPanel.vue'
  import UserStatusBadge from './UserStatusBadge.vue'

  const props = defineProps<{
    open: boolean
    user: User | null
  }>()

  const emit = defineEmits<{
    'update:open': [value: boolean]
    edit: [user: User]
    delete: [user: User]
  }>()

  const openModel = computed({
    get: () => props.open,
    set: v => emit('update:open', v),
  })

  const handleEdit = () => {
    if (props.user) emit('edit', props.user)
  }

  const handleDelete = () => {
    if (props.user) emit('delete', props.user)
  }
</script>

<template>
  <DetailDialog
    v-model:open="openModel"
    title="User · Detail"
    :hero-title="user?.name"
    :hero-subtitle="user?.email"
  >
    <template v-if="user" #hero>
      <UserAvatar :name="user.name" size="lg" />
      <div class="min-w-0 flex-1">
        <h3 class="heading-s text-foreground truncate">{{ user.name }}</h3>
        <p class="body-caption text-muted-foreground mt-0.5 truncate">{{ user.email }}</p>
      </div>
      <div class="flex shrink-0 flex-wrap items-center gap-1.5">
        <UserStatusBadge :status="user.status" />
        <Badge variant="neutral">{{ userRoleLabel[user.role] }}</Badge>
      </div>
    </template>

    <UserDetailPanel v-if="user" :user="user" />

    <template #footer>
      <Button v-if="user" variant="danger" soft @click="handleDelete">
        <Trash2 class="size-4" />
        Delete
      </Button>
      <Button v-if="user" variant="primary" @click="handleEdit">
        <Pencil class="size-4" />
        Edit user
      </Button>
    </template>
  </DetailDialog>
</template>
