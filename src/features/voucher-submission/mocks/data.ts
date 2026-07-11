import type { QuotaGroup, SubmissionDetail, SubmissionRow, SubmissionVoucherCode } from '../types'

export const MOCK_QUOTA_GROUPS: QuotaGroup[] = [
  {
    id: 'invitation',
    name: 'Invitation',
    used: 30,
    total: 575,
    buckets: [
      { id: '5k', label: '5K', used: 10 },
      { id: '10k', label: '10K', used: 10 },
      { id: '21k', label: '21K', used: 10 },
    ],
  },
  {
    id: 'group',
    name: 'Group',
    used: 30,
    total: 575,
    buckets: [
      { id: '5k', label: '5K', used: 10 },
      { id: '10k', label: '10K', used: 10 },
      { id: '21k', label: '21K', used: 10 },
    ],
  },
]

const BASE_ROW: Omit<SubmissionRow, 'id' | 'category' | 'status'> = {
  submittedAt: '2026-08-01T10:00:00+07:00',
  name: 'Pangeran Jaka',
  phone: '08123456789',
  email: 'pangeran@gmail.com',
  company: 'PT PLN ICON PLUS',
  totalVouchers: 30,
}

const makeRow = (
  id: string,
  status: SubmissionRow['status'],
  category: SubmissionRow['category'],
): SubmissionRow => ({ id, category, status, ...BASE_ROW })

export const MOCK_SUBMISSION_LIST: SubmissionRow[] = [
  makeRow('ER121IN', 'approved', 'Invitation'),
  makeRow('ER121GR', 'approved', 'Group'),
  makeRow('ER122IN', 'approved', 'Invitation'),
  makeRow('ER123IN', 'pending', 'Invitation'),
  makeRow('ER123GR', 'pending', 'Group'),
  makeRow('ER124IN', 'pending', 'Invitation'),
  makeRow('ER125IN', 'rejected', 'Invitation'),
  makeRow('ER125GR', 'rejected', 'Group'),
  makeRow('ER126IN', 'rejected', 'Invitation'),
]

// Vouchers are generated only after approval in real business logic; mock also
// seeds rejected entries so all statuses render the voucher table for preview.
const MOCK_VOUCHERS_BY_STATUS: Record<SubmissionRow['status'], SubmissionVoucherCode[]> = {
  approved: [
    {
      no: 1,
      code: 'VCHR-A1B2C3',
      generatedAt: '2026-07-01T00:00:00+07:00',
      status: 'used',
      category: 'Invitation',
      type: '5K',
    },
    {
      no: 2,
      code: 'VCHR-D4E5F6',
      generatedAt: '2026-07-01T00:00:00+07:00',
      status: 'unused',
      category: 'Invitation',
      type: '10K',
    },
    {
      no: 3,
      code: 'VCHR-G7H8I9',
      generatedAt: '2026-07-01T00:00:00+07:00',
      status: 'used',
      category: 'Group',
      type: '21K',
    },
  ],
  pending: [],
  rejected: [
    {
      no: 1,
      code: 'VCHR-R1S2T3',
      generatedAt: '2026-07-01T00:00:00+07:00',
      status: 'unused',
      category: 'Invitation',
      type: '5K',
    },
    {
      no: 2,
      code: 'VCHR-R4S5T6',
      generatedAt: '2026-07-01T00:00:00+07:00',
      status: 'unused',
      category: 'Invitation',
      type: '10K',
    },
  ],
}

export const buildMockDetail = (row: SubmissionRow): SubmissionDetail => {
  const requested = 10
  const quantities = [
    {
      id: '5k',
      category: row.category,
      type: '5K',
      requested,
      approved: row.status === 'approved' ? 10 : undefined,
    },
    {
      id: '10k',
      category: row.category,
      type: '10K',
      requested,
      approved: row.status === 'approved' ? 9 : undefined,
    },
    {
      id: '21k',
      category: row.category,
      type: '21K',
      requested,
      approved: row.status === 'approved' ? 5 : undefined,
    },
  ]
  return {
    ...row,
    quantities,
    vouchers: MOCK_VOUCHERS_BY_STATUS[row.status],
  }
}
