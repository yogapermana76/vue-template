import type {
  InvitationCountData,
  InvitationDetail,
  InvitationListRow,
  InvitationStatus,
  InvitationSummaryCategory,
} from '@/types/services'
import type { QuotaGroup, SubmissionDetail, SubmissionRow, SubmissionStatus } from './types'

/** Backend `Disapproved` → local `rejected`; other statuses pass through. */
export const toBackendStatus = (local: SubmissionStatus): InvitationStatus =>
  local === 'rejected' ? 'disapproved' : local

/** Backend `disapproved` → local `rejected`; other statuses pass through. */
export const toLocalStatus = (backend: InvitationStatus): SubmissionStatus =>
  backend === 'disapproved' ? 'rejected' : backend

export const toSubmissionRow = (
  row: InvitationListRow,
  status: SubmissionStatus,
): SubmissionRow => ({
  id: row.ID,
  requestCode: row.RequestCode,
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

export const toSubmissionDetail = (data: InvitationDetail): SubmissionDetail => {
  const status = toLocalStatus(data.Status)
  const totalRequested = data.Tickets.reduce((sum, t) => sum + t.Quota, 0)
  return {
    id: data.ID,
    requestCode: data.RequestCode,
    submittedAt: data.CreatedAt,
    name: data.Name,
    phone: data.Phone,
    email: data.Email,
    company: data.CompanyName,
    // First ticket's category — list-view compatibility. Detail UI uses the
    // per-ticket category in quantities/vouchers below.
    category: data.Tickets[0]?.CategoryName ?? '',
    totalVouchers: totalRequested,
    status,
    quantities: data.Tickets.map(t => ({
      ticketId: t.TicketID,
      category: t.CategoryName,
      type: t.TicketName,
      requested: t.Quota,
      approved: t.QuotaApproved,
    })),
    vouchers: data.Vouchers.map((v, index) => ({
      no: index + 1,
      voucherId: v.VoucherID,
      code: v.Code,
      generatedAt: v.CreatedAt,
      // Backend `AVAILABLE` → not-yet-used; anything else is treated as used.
      status: v.Status === 'AVAILABLE' ? 'unused' : 'used',
      category: v.CategoryName,
      type: v.TicketName,
      releasable: v.Releasable,
    })),
  }
}
