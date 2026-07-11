import { computed, ref } from 'vue'
import type { Product, ProductFormValues, ProductStatusFilter } from '../types'

const emptyForm = (): ProductFormValues => ({
  name: '',
  sku: '',
  category: '',
  brand: '',
  description: '',
  price: 0,
  cost: 0,
  stock: 0,
  status: 'active',
  supplier: '',
  warehouse: '',
})

const seed = (): Product[] => [
  {
    id: 1,
    name: 'Wireless Headphones',
    sku: 'WH-001',
    category: 'Electronics',
    brand: 'TechSound',
    description: 'Over-ear wireless headphones with active noise cancellation.',
    price: 79.99,
    cost: 45.0,
    margin: 43.7,
    stock: 45,
    status: 'active',
    supplier: 'Global Electronics',
    warehouse: 'Warehouse A',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'Smart Watch',
    sku: 'SW-002',
    category: 'Electronics',
    brand: 'FitTech',
    description: 'Fitness-focused smart watch with heart-rate tracking.',
    price: 199.99,
    cost: 120.0,
    margin: 40.0,
    stock: 23,
    status: 'active',
    supplier: 'Smart Devices Inc',
    warehouse: 'Warehouse B',
    createdAt: '2024-01-20',
  },
  {
    id: 3,
    name: 'Coffee Maker',
    sku: 'CM-003',
    category: 'Appliances',
    brand: 'BrewMaster',
    description: 'Programmable drip coffee maker, 12-cup capacity.',
    price: 49.99,
    cost: 28.0,
    margin: 44.0,
    stock: 0,
    status: 'out_of_stock',
    supplier: 'Home Appliances Co',
    warehouse: 'Warehouse A',
    createdAt: '2024-02-01',
  },
  {
    id: 4,
    name: 'Yoga Mat',
    sku: 'YM-004',
    category: 'Sports',
    brand: 'FlexFit',
    price: 29.99,
    cost: 12.0,
    margin: 60.0,
    stock: 67,
    status: 'active',
    supplier: 'Sports Gear Ltd',
    warehouse: 'Warehouse C',
    createdAt: '2024-02-10',
  },
  {
    id: 5,
    name: 'Desk Lamp',
    sku: 'DL-005',
    category: 'Furniture',
    brand: 'LightPro',
    price: 34.99,
    cost: 18.0,
    margin: 48.6,
    stock: 12,
    status: 'active',
    supplier: 'Office Supplies Inc',
    warehouse: 'Warehouse A',
    createdAt: '2024-02-15',
  },
  {
    id: 7,
    name: 'Laptop Stand',
    sku: 'LS-007',
    category: 'Accessories',
    brand: 'ErgoDesk',
    price: 39.99,
    cost: 22.0,
    margin: 45.0,
    stock: 5,
    status: 'inactive',
    supplier: 'Office Supplies Inc',
    warehouse: 'Warehouse B',
    createdAt: '2024-03-01',
  },
]

const calcMargin = (price: number, cost: number) =>
  price > 0 ? Number((((price - cost) / price) * 100).toFixed(1)) : 0

export function useProductsCrud() {
  const products = ref<Product[]>(seed())
  const loading = ref(false)
  const selectedRows = ref<number[]>([])
  const statusFilter = ref<ProductStatusFilter>('all')
  const categoryFilter = ref<string>('all')
  const searchQuery = ref('')

  const filteredProducts = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    return products.value.filter(p => {
      if (statusFilter.value !== 'all' && p.status !== statusFilter.value) return false
      if (categoryFilter.value !== 'all' && p.category !== categoryFilter.value) return false
      if (!q) return true
      return [p.name, p.sku, p.category, p.brand, p.supplier, p.warehouse, p.description]
        .filter((v): v is string => typeof v === 'string' && v.length > 0)
        .some(v => v.toLowerCase().includes(q))
    })
  })

  const detailOpen = ref(false)
  const detailProduct = ref<Product | null>(null)

  const openDetail = (product: Product) => {
    detailProduct.value = product
    detailOpen.value = true
  }

  const formOpen = ref(false)
  const formMode = ref<'create' | 'edit'>('create')
  const formSaving = ref(false)
  const editingId = ref<number | null>(null)
  const form = ref<ProductFormValues>(emptyForm())

  const openCreate = () => {
    formMode.value = 'create'
    editingId.value = null
    form.value = emptyForm()
    formOpen.value = true
  }

  const openEdit = (product: Product) => {
    formMode.value = 'edit'
    editingId.value = product.id
    form.value = {
      name: product.name,
      sku: product.sku,
      category: product.category,
      brand: product.brand,
      description: product.description ?? '',
      price: product.price,
      cost: product.cost,
      stock: product.stock,
      status: product.status,
      supplier: product.supplier,
      warehouse: product.warehouse,
    }
    formOpen.value = true
  }

  const submitForm = async () => {
    formSaving.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 400))
      const margin = calcMargin(form.value.price, form.value.cost)

      if (formMode.value === 'create') {
        const nextId = Math.max(0, ...products.value.map(p => p.id)) + 1
        products.value.unshift({
          id: nextId,
          ...form.value,
          margin,
          createdAt: new Date().toISOString().slice(0, 10),
        })
      } else if (editingId.value != null) {
        const idx = products.value.findIndex(p => p.id === editingId.value)
        if (idx !== -1) {
          products.value[idx] = { ...products.value[idx], ...form.value, margin }
        }
      }
      formOpen.value = false
    } finally {
      formSaving.value = false
    }
  }

  const confirmOpen = ref(false)
  const deletingProduct = ref<Product | null>(null)
  const deleteLoading = ref(false)

  const openDelete = (product: Product) => {
    deletingProduct.value = product
    confirmOpen.value = true
  }

  const confirmDelete = async () => {
    if (!deletingProduct.value) return
    deleteLoading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      products.value = products.value.filter(p => p.id !== deletingProduct.value!.id)
      confirmOpen.value = false
      deletingProduct.value = null
    } finally {
      deleteLoading.value = false
    }
  }

  return {
    products,
    filteredProducts,
    loading,
    selectedRows,
    statusFilter,
    categoryFilter,
    searchQuery,
    detailOpen,
    detailProduct,
    openDetail,
    formOpen,
    formMode,
    formSaving,
    form,
    openCreate,
    openEdit,
    submitForm,
    confirmOpen,
    deletingProduct,
    deleteLoading,
    openDelete,
    confirmDelete,
  }
}
