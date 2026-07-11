import { ClipboardCheck, Ticket, TicketCheck } from 'lucide-vue-next'
import type { NavGroup } from './types'

/**
 * Dashboard sidebar navigation.
 *
 * Currently Loket-only: the admin surface has been trimmed down to the
 * Loket module (dashboard + ticket monitoring). Non-Loket sections
 * (overview, catalog, commerce, people, system, forms) were removed
 * with the rest of the PLN Mobile stack. Bring them back here when we
 * start wiring up additional modules.
 */
export const dashboardNavGroups: NavGroup[] = [
  {
    label: 'Loket',
    items: [
      {
        id: 'loket-dashboard',
        label: 'Dashboard Loket',
        icon: Ticket,
        to: '/dashboard',
      },
      {
        id: 'loket-monitoring',
        label: 'Monitoring Tiket',
        icon: TicketCheck,
        to: '/monitoring',
      },
      {
        id: 'voucher-submission',
        label: 'Pengajuan',
        icon: ClipboardCheck,
        to: '/voucher-submission',
      },
    ],
  },
]
