import { computed, ref } from 'vue'
import type { Category, CategoryFormValues } from '../types'

const emptyForm = (): CategoryFormValues => ({
  name: '',
  slug: '',
  parent: '',
  isPublished: true,
})

const seed = (): Category[] => [
  {
    id: 1,
    name: 'Wireless Audio',
    slug: 'wireless-audio',
    parent: 'Electronics',
    productsCount: 42,
    isPublished: true,
    updatedAt: '2026-06-30',
  },
  {
    id: 2,
    name: 'Smart Home',
    slug: 'smart-home',
    parent: 'Home & Living',
    productsCount: 87,
    isPublished: true,
    updatedAt: '2026-07-01',
  },
  {
    id: 3,
    name: 'Women Outerwear',
    slug: 'women-outerwear',
    parent: 'Fashion',
    productsCount: 15,
    isPublished: false,
    updatedAt: '2026-06-28',
  },
  {
    id: 4,
    name: 'Skincare',
    slug: 'skincare',
    parent: 'Beauty',
    productsCount: 63,
    isPublished: true,
    updatedAt: '2026-07-05',
  },
  {
    id: 5,
    name: 'Kitchenware',
    slug: 'kitchenware',
    parent: 'Home & Living',
    productsCount: 28,
    isPublished: true,
    updatedAt: '2026-07-02',
  },
]

const slugify = (v: string) =>
  v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

export function useCategoriesCrud() {
  const categories = ref<Category[]>(seed())
  const loading = ref(false)
  const selectedRows = ref<number[]>([])
  const searchQuery = ref('')

  const filteredCategories = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    if (!q) return categories.value
    return categories.value.filter(c =>
      [c.name, c.slug, c.parent].filter(Boolean).some(v => v!.toLowerCase().includes(q)),
    )
  })

  const formOpen = ref(false)
  const formMode = ref<'create' | 'edit'>('create')
  const formSaving = ref(false)
  const editingId = ref<number | null>(null)
  const form = ref<CategoryFormValues>(emptyForm())

  const openCreate = () => {
    formMode.value = 'create'
    editingId.value = null
    form.value = emptyForm()
    formOpen.value = true
  }

  const openEdit = (category: Category) => {
    formMode.value = 'edit'
    editingId.value = category.id
    form.value = {
      name: category.name,
      slug: category.slug,
      parent: category.parent ?? '',
      isPublished: category.isPublished,
    }
    formOpen.value = true
  }

  const autoSlug = () => {
    form.value.slug = slugify(form.value.name)
  }

  const submitForm = async () => {
    formSaving.value = true
    try {
      await new Promise(r => setTimeout(r, 300))
      const today = new Date().toISOString().slice(0, 10)
      if (formMode.value === 'create') {
        const nextId = Math.max(0, ...categories.value.map(c => c.id)) + 1
        categories.value.unshift({
          id: nextId,
          ...form.value,
          productsCount: 0,
          updatedAt: today,
        })
      } else if (editingId.value != null) {
        const idx = categories.value.findIndex(c => c.id === editingId.value)
        if (idx !== -1) {
          categories.value[idx] = {
            ...categories.value[idx],
            ...form.value,
            updatedAt: today,
          }
        }
      }
      formOpen.value = false
    } finally {
      formSaving.value = false
    }
  }

  const confirmOpen = ref(false)
  const deleting = ref<Category | null>(null)
  const deleteLoading = ref(false)

  const openDelete = (category: Category) => {
    deleting.value = category
    confirmOpen.value = true
  }

  const confirmDelete = async () => {
    if (!deleting.value) return
    deleteLoading.value = true
    try {
      await new Promise(r => setTimeout(r, 250))
      categories.value = categories.value.filter(c => c.id !== deleting.value!.id)
      confirmOpen.value = false
      deleting.value = null
    } finally {
      deleteLoading.value = false
    }
  }

  return {
    categories,
    filteredCategories,
    loading,
    selectedRows,
    searchQuery,

    formOpen,
    formMode,
    formSaving,
    form,
    openCreate,
    openEdit,
    autoSlug,
    submitForm,

    confirmOpen,
    deleting,
    deleteLoading,
    openDelete,
    confirmDelete,
  }
}
