/**
 * Monitoring API Endpoints
 */
export const MonitoringEndpoint = {
  MONITORING: (programId: number | string) => `/v2/monitoring/${programId}`,
  EXPORT: (programId: number | string) => `/v2/monitoring/export/${programId}`,
} as const
