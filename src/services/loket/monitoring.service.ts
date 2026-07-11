/**
 * Loket Monitoring Service
 * Handles ticket monitoring for the Loket module
 */

import { loketHttp } from '../http'
import { stripEmpty } from '../http/params'
import { LoketMonitoringEndpoint } from './endpoints'
import type { LoketMonitoringParams, LoketMonitoringResponse } from '@/types/services/loket'

/**
 * Strip `programId` (goes into the URL, not the query) and remove any
 * undefined / null / empty-string filters so they aren't serialised into
 * `?Keyword=&OrderStartDate=&...` — backend treats blank keys differently
 * from an omitted key.
 */
function toQueryParams(params: LoketMonitoringParams) {
  const { programId, ...rest } = params
  void programId
  return stripEmpty(rest)
}

export const loketMonitoringService = {
  async getMonitoring(params: LoketMonitoringParams): Promise<LoketMonitoringResponse> {
    const url = LoketMonitoringEndpoint.MONITORING.replace(':programId', String(params.programId))
    const { data } = await loketHttp.get<LoketMonitoringResponse>(url, {
      params: toQueryParams(params),
    })
    return data
  },

  async exportMonitoring(params: LoketMonitoringParams): Promise<Blob> {
    const url = LoketMonitoringEndpoint.EXPORT.replace(':programId', String(params.programId))
    const { data } = await loketHttp.get<Blob>(url, {
      params: toQueryParams(params),
      responseType: 'blob',
    })
    return data
  },
}
