import { computed, ref } from 'vue'
import type { User, UserFormValues, UserStatusFilter } from '../types'

const emptyForm = (): UserFormValues => ({
  name: '',
  email: '',
  role: 'staff',
  status: 'invited',
  phone: '',
  department: '',
})

const seed = (): User[] => [
  {
    id: 1,
    name: 'Ayu Pertiwi',
    email: 'ayu.pertiwi@example.com',
    role: 'admin',
    status: 'active',
    phone: '+62 812 3456 7890',
    department: 'Operations',
    joinedAt: '2023-08-10',
    lastLoginAt: '2026-07-05',
  },
  {
    id: 2,
    name: 'Budi Santoso',
    email: 'budi.santoso@example.com',
    role: 'manager',
    status: 'active',
    phone: '+62 813 9988 7766',
    department: 'Sales',
    joinedAt: '2024-01-04',
    lastLoginAt: '2026-07-04',
  },
  {
    id: 3,
    name: 'Citra Wijaya',
    email: 'citra.wijaya@example.com',
    role: 'staff',
    status: 'invited',
    department: 'Support',
    joinedAt: '2026-06-20',
  },
  {
    id: 4,
    name: 'Dimas Prasetya',
    email: 'dimas.prasetya@example.com',
    role: 'staff',
    status: 'suspended',
    department: 'Warehouse',
    joinedAt: '2024-11-11',
    lastLoginAt: '2026-05-28',
  },
  {
    id: 5,
    name: 'Elin Marlina',
    email: 'elin.marlina@example.com',
    role: 'manager',
    status: 'active',
    phone: '+62 811 0011 2233',
    department: 'Finance',
    joinedAt: '2024-03-01',
    lastLoginAt: '2026-07-06',
  },
]

export function useUsersCrud() {
  const users = ref<User[]>(seed())
  const loading = ref(false)
  const selectedRows = ref<number[]>([])
  const statusFilter = ref<UserStatusFilter>('all')
  const roleFilter = ref<string>('all')
  const searchQuery = ref('')

  const filteredUsers = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    return users.value.filter(u => {
      if (statusFilter.value !== 'all' && u.status !== statusFilter.value) return false
      if (roleFilter.value !== 'all' && u.role !== roleFilter.value) return false
      if (!q) return true
      return [u.name, u.email, u.department, u.phone]
        .filter((v): v is string => typeof v === 'string' && v.length > 0)
        .some(v => v.toLowerCase().includes(q))
    })
  })

  const detailOpen = ref(false)
  const detailUser = ref<User | null>(null)

  const openDetail = (user: User) => {
    detailUser.value = user
    detailOpen.value = true
  }

  const formOpen = ref(false)
  const formMode = ref<'create' | 'edit'>('create')
  const formSaving = ref(false)
  const editingId = ref<number | null>(null)
  const form = ref<UserFormValues>(emptyForm())

  const openCreate = () => {
    formMode.value = 'create'
    editingId.value = null
    form.value = emptyForm()
    formOpen.value = true
  }

  const openEdit = (user: User) => {
    formMode.value = 'edit'
    editingId.value = user.id
    form.value = {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone ?? '',
      department: user.department ?? '',
    }
    formOpen.value = true
  }

  const submitForm = async () => {
    formSaving.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 400))
      if (formMode.value === 'create') {
        const nextId = Math.max(0, ...users.value.map(u => u.id)) + 1
        users.value.unshift({
          id: nextId,
          ...form.value,
          joinedAt: new Date().toISOString().slice(0, 10),
        })
      } else if (editingId.value != null) {
        const idx = users.value.findIndex(u => u.id === editingId.value)
        if (idx !== -1) users.value[idx] = { ...users.value[idx], ...form.value }
      }
      formOpen.value = false
    } finally {
      formSaving.value = false
    }
  }

  const confirmOpen = ref(false)
  const deletingUser = ref<User | null>(null)
  const deleteLoading = ref(false)

  const openDelete = (user: User) => {
    deletingUser.value = user
    confirmOpen.value = true
  }

  const confirmDelete = async () => {
    if (!deletingUser.value) return
    deleteLoading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      users.value = users.value.filter(u => u.id !== deletingUser.value!.id)
      confirmOpen.value = false
      deletingUser.value = null
    } finally {
      deleteLoading.value = false
    }
  }

  return {
    users,
    filteredUsers,
    loading,
    selectedRows,
    statusFilter,
    roleFilter,
    searchQuery,

    detailOpen,
    detailUser,
    openDetail,

    formOpen,
    formMode,
    formSaving,
    form,
    openCreate,
    openEdit,
    submitForm,

    confirmOpen,
    deletingUser,
    deleteLoading,
    openDelete,
    confirmDelete,
  }
}
