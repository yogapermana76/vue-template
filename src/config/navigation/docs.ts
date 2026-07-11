import {
  ArrowLeft,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Package,
  Receipt,
  Tag,
  Ticket,
  Users,
} from 'lucide-vue-next'
import type { NavGroup } from './types'

/**
 * Sidebar navigation for the `/docs/*` surface.
 *
 * These pages are **reference material** for the team building on top of
 * this template — they're not part of the Loket production surface. Kept
 * in its own nav config so the Loket sidebar (`dashboardNavGroups`) stays
 * lean and doesn't advertise example pages that shouldn't ship.
 *
 * Grouping mirrors the shape of a typical admin console (Catalog / People
 * / Commerce) so it reads as "here's the pattern for each domain" rather
 * than a flat list.
 */
export const docsNavGroups: NavGroup[] = [
  {
    label: 'Navigation',
    items: [
      {
        id: 'back-to-loket',
        label: 'Back to Loket',
        icon: ArrowLeft,
        to: '/dashboard',
      },
    ],
  },
  {
    label: 'Getting started',
    items: [
      {
        id: 'overview',
        label: 'Overview',
        icon: LayoutDashboard,
        to: '/docs/admin-examples/overview',
      },
      {
        id: 'form-showcase',
        label: 'Form components',
        icon: FileText,
        to: '/docs/form-showcase',
      },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { id: 'products', label: 'Products', icon: Package, to: '/docs/admin-examples/products' },
      { id: 'categories', label: 'Categories', icon: Tag, to: '/docs/admin-examples/categories' },
      { id: 'vouchers', label: 'Vouchers', icon: Ticket, to: '/docs/admin-examples/vouchers' },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { id: 'orders', label: 'Orders', icon: ClipboardList, to: '/docs/admin-examples/orders' },
      { id: 'invoices', label: 'Invoices', icon: Receipt, to: '/docs/admin-examples/invoices' },
    ],
  },
  {
    label: 'People',
    items: [{ id: 'users', label: 'Users', icon: Users, to: '/docs/admin-examples/users' }],
  },
]
