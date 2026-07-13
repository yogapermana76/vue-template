import type {
  InvitationCountData,
  InvitationListRow,
  InvitationStatus,
  InvitationSummaryCategory,
} from '@/types/services'
import type { QuotaGroup, SubmissionRow, SubmissionStatus } from './types'

/** Backend `Disapproved` → local `rejected`; other statuses pass through. */
export const toBackendStatus = (local: SubmissionStatus): InvitationStatus =>
  local === 'rejected' ? 'disapproved' : local

export const toSubmissionRow = (
  row: InvitationListRow,
  status: SubmissionStatus,
): SubmissionRow => ({
  id: row.RequestCode,
  backendId: row.ID,
  submittedAt: row.CreatedAt,
  name: row.Name,
  phone: row.Phone,
  email: row.Email,
  company: row.CompanyName,
  category: row.CategoryName,
  totalVouchers: row.TotalQuota,
  status,
})

export const toQuotaGroups = (categories: InvitationSummaryCategory[]): QuotaGroup[] =>
  categories.map(cat => ({
    id: String(cat.CategoryId),
    name: cat.CategoryName,
    used: cat.TotalPending + cat.TotalApproved,
    total: cat.TotalQuota,
    buckets: cat.Tickets.map(t => ({
      id: String(t.Id),
      label: t.Name,
      used: t.Pending + t.Approved,
    })),
  }))

export const toStatusCounts = (
  raw: InvitationCountData | undefined,
): Record<SubmissionStatus, number> => ({
  pending: raw?.Pending ?? 0,
  approved: raw?.Approved ?? 0,
  rejected: raw?.Disapproved ?? 0,
})
