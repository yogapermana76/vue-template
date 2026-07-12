/**
 * Invitation API Endpoints
 */
export const InvitationEndpoint = {
  REGISTER: (programSlug: string) => `/v2/public/invitation/register/${programSlug}`,
  PROGRAM_INFO: (programId: number | string) => `/v2/public/invitation/info/program/${programId}`,
  CATEGORY_INFO: (programId: number | string, categoryId: number | string) =>
    `/v2/public/invitation/info/program/${programId}/${categoryId}`,
  APPROVE: '/v2/invitation/approve',
} as const
