import { CheckCircle2, CircleDashed, Coins, Ticket, TicketCheck, Users } from 'lucide-vue-next'
import type { StatCard } from './types'

export const STAT_CARDS: StatCard[] = [
  {
    key: 'PurchasedTicketCount',
    title: 'Jumlah Tiket Terjual',
    icon: Ticket,
    format: 'number',
    tone: 'primary',
  },
  {
    key: 'TransactionCount',
    title: 'Jumlah Transaksi',
    icon: Users,
    format: 'number',
    tone: 'info',
  },
  {
    key: 'TotalIncomeAmount',
    title: 'Total Pendapatan',
    icon: Coins,
    format: 'currency',
    tone: 'success',
  },
  {
    key: 'CheckedCount',
    // Backend counts visitors, not tickets — the label reflects that.
    title: 'Jumlah Pengunjung Sudah Check In',
    icon: TicketCheck,
    format: 'number',
    tone: 'success',
  },
  {
    key: 'UncheckedCount',
    title: 'Jumlah Pengunjung Belum Check In',
    icon: CircleDashed,
    format: 'number',
    tone: 'warning',
  },
  {
    key: 'BookedTicketCount',
    title: 'Tiket Dipesan',
    icon: CheckCircle2,
    format: 'number',
    tone: 'neutral',
  },
]

export const DASHBOARD_PAGE_SIZE = 25

/** Shared across dashboard/monitoring/scan so TanStack Query dedupes into one cache entry. */
export const PROGRAMS_PAGE_SIZE = 100

/** 5s semi-realtime polling; TanStack pauses when tab loses focus. */
export const STATISTICS_POLL_MS = 5000
