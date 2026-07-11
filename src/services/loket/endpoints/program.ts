/**
 * Loket Program/Dashboard API Endpoints
 */
export const LoketProgramEndpoint = {
  PROGRAMS: '/v2/dashboard/programs',
  BANNERS: '/v2/dashboard/banners/:programId',
  CATEGORIES: '/v2/dashboard/categories/:programId',
  SCHEDULES: '/v2/dashboard/schedules/:programId',
  STATISTICS: '/v2/dashboard/statistics/:programId',
} as const
