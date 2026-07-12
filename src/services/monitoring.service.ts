/**
 * Monitoring Service
 * Handles ticket monitoring for the app
 */

import { http } from './http'
import { stripEmpty } from './http/params'
import { MonitoringEndpoint } from './endpoints'
import type { MonitoringParams, MonitoringResponse } from '@/types/services'

/**
 * Strip `programId` (goes into the URL, not the query) and remove any
 * undefined / null / empty-string filters so they aren't serialised into
 * `?Keyword=&OrderStartDate=&...` — backend treats blank keys differently
 * from an omitted key.
 */
function toQueryParams(params: MonitoringParams) {
  const { programId, ...rest } = params
  void programId
  return stripEmpty(rest)
}

export const monitoringService = {
  async getMonitoring(params: MonitoringParams): Promise<MonitoringResponse> {
    const { data } = await http.get<MonitoringResponse>(
      MonitoringEndpoint.MONITORING(params.programId),
      {
        params: toQueryParams(params),
      },
    )
    return data
  },

  async exportMonitoring(params: MonitoringParams): Promise<Blob> {
    const { data } = await http.get<Blob>(MonitoringEndpoint.EXPORT(params.programId), {
      params: toQueryParams(params),
      responseType: 'blob',
    })
    return data
  },
}
