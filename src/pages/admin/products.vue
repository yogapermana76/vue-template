<script setup lang="ts">
  import type { ColumnDef, TableAction } from '@/components/ui/table'
  import { Package, Pencil, Trash2 } from 'lucide-vue-next'
  import { ref } from 'vue'

  definePage({
    meta: {
      // Option 1: Custom breadcrumbs as array (full control)
      breadcrumbs: [
        { label: 'Home', to: '/admin/overview' },
        { label: 'Product Management' }, // Current page (no 'to' property)
      ],
      // Option 2: Simple string label (auto-generated breadcrumb path)
      // breadcrumb: 'Product Management',
    },
  })
  import { Badge } from '@/components/ui/badge'
  import { CardSection } from '@/components/shared'
  import { DataTable, TableActions } from '@/components/ui/table'
  import { formatCurrency } from '@/utils/currency'
  import { formatDate as formatDateUtil } from '@/utils/date'

  // Product interface
  interface Product {
    id: number
    name: string
    sku: string
    category: string
    brand: string
    price: number
    cost: number
    margin: number
    stock: number
    status: 'active' | 'inactive' | 'out_of_stock'
    supplier: string
    warehouse: string
    createdAt: string
  }

  // Sample data
  const products = ref<Product[]>([
    {
      id: 1,
      name: 'Wireless Headphones',
      sku: 'WH-001',
      category: 'Electronics',
      brand: 'TechSound',
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
      id: 6,
      name: 'Water Bottle',
      sku: 'WB-006',
      category: 'Sports',
      brand: 'HydroFlow',
      price: 19.99,
      cost: 8.0,
      margin: 60.0,
      stock: 89,
      status: 'active',
      supplier: 'Sports Gear Ltd',
      warehouse: 'Warehouse C',
      createdAt: '2024-02-20',
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
    {
      id: 8,
      name: 'Phone Case',
      sku: 'PC-008',
      category: 'Accessories',
      brand: 'ProtectPro',
      price: 14.99,
      cost: 5.0,
      margin: 66.7,
      stock: 120,
      status: 'active',
      supplier: 'Mobile Accessories Co',
      warehouse: 'Warehouse A',
      createdAt: '2024-03-05',
    },
    {
      id: 9,
      name: 'Bluetooth Speaker',
      sku: 'BS-009',
      category: 'Electronics',
      brand: 'SoundWave',
      price: 59.99,
      cost: 35.0,
      margin: 41.7,
      stock: 34,
      status: 'active',
      supplier: 'Global Electronics',
      warehouse: 'Warehouse B',
      createdAt: '2024-03-10',
    },
    {
      id: 10,
      name: 'Gaming Mouse',
      sku: 'GM-010',
      category: 'Electronics',
      brand: 'ProGamer',
      price: 44.99,
      cost: 25.0,
      margin: 44.4,
      stock: 56,
      status: 'active',
      supplier: 'Gaming Gear Co',
      warehouse: 'Warehouse A',
      createdAt: '2024-03-15',
    },
    {
      id: 11,
      name: 'Mechanical Keyboard',
      sku: 'MK-011',
      category: 'Electronics',
      brand: 'KeyMaster',
      price: 89.99,
      cost: 50.0,
      margin: 44.4,
      stock: 28,
      status: 'active',
      supplier: 'Gaming Gear Co',
      warehouse: 'Warehouse B',
      createdAt: '2024-03-18',
    },
    {
      id: 12,
      name: 'Portable Charger',
      sku: 'PC-012',
      category: 'Accessories',
      brand: 'PowerBank',
      price: 24.99,
      cost: 12.0,
      margin: 52.0,
      stock: 0,
      status: 'out_of_stock',
      supplier: 'Mobile Accessories Co',
      warehouse: 'Warehouse C',
      createdAt: '2024-03-20',
    },
  ])

  // Selected rows
  const selectedRows = ref<number[]>([])

  // Loading state (for demo)
  const loading = ref(false)

  // Status badge variant mapping
  const getStatusVariant = (status: Product['status']): 'success' | 'default' | 'destructive' => {
    switch (status) {
      case 'active':
        return 'success'
      case 'inactive':
        return 'default'
      case 'out_of_stock':
        return 'destructive'
      default:
        return 'default'
    }
  }

  // Status label mapping
  const getStatusLabel = (status: Product['status']): string => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'inactive':
        return 'Inactive'
      case 'out_of_stock':
        return 'Out of Stock'
      default:
        return status
    }
  }

  // Column definitions - Using default min-width (120px) for most columns
  const columns: ColumnDef<Product>[] = [
    {
      key: 'name',
      label: 'Product Name',
      sortable: true,
      cell: 'name',
      sticky: 'left',
      minWidth: '250px',
    },
    {
      key: 'sku',
      label: 'SKU',
      sortable: true,
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
    },
    {
      key: 'brand',
      label: 'Brand',
      sortable: true,
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      align: 'right',
      cell: 'price',
    },
    {
      key: 'cost',
      label: 'Cost',
      sortable: true,
      align: 'right',
      cell: 'cost',
    },
    {
      key: 'margin',
      label: 'Margin %',
      sortable: true,
      align: 'right',
      cell: 'margin',
    },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
      align: 'center',
      cell: 'stock',
    },
    {
      key: 'supplier',
      label: 'Supplier',
      sortable: true,
    },
    {
      key: 'warehouse',
      label: 'Warehouse',
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      cell: 'createdAt',
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      align: 'center',
      cell: 'status',
      sticky: 'right',
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center',
      sortable: false,
      cell: 'actions',
      sticky: 'right',
    },
  ]

  // Helper functions for cell formatting
  const formatPrice = (price: number) => formatCurrency(price, 'USD')

  const formatProductDate = (dateString: string) => formatDateUtil(dateString, 'dd MMM yyyy')

  const getStockColorClass = (stock: number) => {
    if (stock === 0) return 'text-error-600'
    if (stock < 20) return 'text-warning-600'
    return 'text-success-600'
  }

  // Get table actions for a product
  const getProductActions = (product: Product): TableAction[] => [
    {
      key: 'edit',
      label: 'Edit',
      icon: Pencil,
      onClick: () => handleEdit(product.id),
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: Trash2,
      variant: 'destructive',
      onClick: () => handleDelete(product.id),
      separator: true,
    },
  ]

  // Actions
  const handleEdit = (id: number) => {
    // TODO: Implement edit functionality
    alert(`Edit product ${id}`)
  }

  const handleDelete = (id: number) => {
    // TODO: Implement delete functionality
    if (confirm(`Are you sure you want to delete product ${id}?`)) {
      products.value = products.value.filter(p => p.id !== id)
    }
  }

  const handleRowClick = (_row: Product) => {
    // TODO: Implement row click functionality
  }

  const handleSelectionChange = (_selection: (string | number)[]) => {
    // TODO: Implement selection change functionality
    selectedRows.value = _selection as number[]
  }
</script>

<template>
  <!-- Table Card -->
  <CardSection title="Product List">
    <DataTable
      :data="products"
      :columns="columns"
      :loading="loading"
      :selectable="true"
      :pagination="true"
      :clickable-rows="false"
      :striped="true"
      row-key="id"
      :selected-rows="selectedRows"
      @update:selected-rows="handleSelectionChange"
      @row-click="handleRowClick"
    >
      <!-- Custom cell: Product Name -->
      <template #cell-name="{ value }">
        <div class="flex items-center gap-2 font-medium">
          <Package class="size-4 text-neutral-500" />
          <span>{{ value }}</span>
        </div>
      </template>

      <!-- Custom cell: Price -->
      <template #cell-price="{ value }">
        <span class="font-medium">{{ formatPrice(value as number) }}</span>
      </template>

      <!-- Custom cell: Cost -->
      <template #cell-cost="{ value }">
        <span class="text-neutral-600">{{ formatPrice(value as number) }}</span>
      </template>

      <!-- Custom cell: Margin -->
      <template #cell-margin="{ value }">
        <span class="text-success-600 font-medium">{{ (value as number).toFixed(1) }}%</span>
      </template>

      <!-- Custom cell: Stock -->
      <template #cell-stock="{ value }">
        <span class="font-semibold" :class="getStockColorClass(value as number)">
          {{ value }}
        </span>
      </template>

      <!-- Custom cell: Status -->
      <template #cell-status="{ row }">
        <Badge :variant="getStatusVariant((row as Product).status)">
          {{ getStatusLabel((row as Product).status) }}
        </Badge>
      </template>

      <!-- Custom cell: Created Date -->
      <template #cell-createdAt="{ value }">
        {{ formatProductDate(value as string) }}
      </template>

      <!-- Custom cell: Actions -->
      <template #cell-actions="{ row }">
        <TableActions :actions="getProductActions(row as Product)" />
      </template>
    </DataTable>
  </CardSection>
</template>
