/**
 * Invitation API Endpoints
 */
export const InvitationEndpoint = {
  REGISTER: (programSlug: string) => `/v2/public/invitation/register/${programSlug}`,
  PROGRAM_INFO: (programId: number | string) => `/v2/public/invitation/info/program/${programId}`,
  CATEGORY_INFO: (programId: number | string, categoryId: number | string) =>
    `/v2/public/invitation/info/program/${programId}/${categoryId}`,
  SUMMARY: (programId: number | string) => `/v2/invitation/summary/${programId}`,
  COUNT: (programId: number | string) => `/v2/invitation/count/${programId}`,
  LIST: (programId: number | string) => `/v2/invitation/list/${programId}`,
  DETAIL: (id: number | string) => `/v2/invitation/detail/${id}`,
  APPROVE_BULK: '/v2/invitation/approve-bulk',
  APPROVE_SINGLE: '/v2/invitation/approve-single',
  RELEASE_VOUCHER: '/v2/invitation/voucher/release',
} as const
