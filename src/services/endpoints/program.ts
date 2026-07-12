/**
 * Program/Dashboard API Endpoints
 */
export const ProgramEndpoint = {
  PROGRAMS: '/v2/dashboard/programs',
  BANNERS: (programId: number | string) => `/v2/dashboard/banners/${programId}`,
  CATEGORIES: (programId: number | string) => `/v2/dashboard/categories/${programId}`,
  SCHEDULES: (programId: number | string) => `/v2/dashboard/schedules/${programId}`,
  STATISTICS: (programId: number | string) => `/v2/dashboard/statistics/${programId}`,
} as const
