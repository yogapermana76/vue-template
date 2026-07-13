import type { SubmissionStatus } from './types'

export interface SubmissionStatusMeta {
  id: SubmissionStatus
  label: string
  countTone: 'success' | 'warning' | 'error'
  badgeVariant: 'success' | 'warning-soft' | 'error-soft'
}

// Label copywriting stays in Indonesian per product requirement — content per screenshots.
export const SUBMISSION_STATUS_META: Record<SubmissionStatus, SubmissionStatusMeta> = {
  approved: {
    id: 'approved',
    label: 'Disetujui',
    countTone: 'success',
    badgeVariant: 'success',
  },
  pending: {
    id: 'pending',
    label: 'Butuh Persetujuan',
    countTone: 'warning',
    badgeVariant: 'warning-soft',
  },
  rejected: {
    id: 'rejected',
    label: 'Ditolak',
    countTone: 'error',
    badgeVariant: 'error-soft',
  },
}

export const SUBMISSION_STATUS_ORDER: SubmissionStatus[] = ['approved', 'pending', 'rejected']
