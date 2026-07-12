/**
 * Invitation API Endpoints
 */
export const InvitationEndpoint = {
  REGISTER: (programSlug: string) => `/public/invitation/register/${programSlug}`,
  PROGRAM_INFO: (programId: number | string) => `/public/invitation/info/program/${programId}`,
  CATEGORY_INFO: (programId: number | string, categoryId: number | string) =>
    `/public/invitation/info/program/${programId}/${categoryId}`,
  APPROVE: '/invitation/approve',
} as const
