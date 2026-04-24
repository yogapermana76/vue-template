/**
 * Lifestyle Queue Types
 * Types for queue management in Lifestyle API
 */

import type { BaseResponse } from '@/types/common/base.types'

// ============================================
// Queue Entities
// ============================================

export interface LifestyleQueueInfo {
  queueId: string
  programId: number
  programName: string
  queueNumber: number
  queuePosition: number
  totalQueue: number
  estimatedWaitTime: number // in minutes
  status: string
  createdAt: string
  calledAt?: string
}

export interface LifestyleQueueStatus {
  currentQueueNumber: number
  waitingCount: number
  averageWaitTime: number
}

// ============================================
// Request Types
// ============================================

export interface LifestyleJoinQueueRequest {
  programId: number
  visitDate: string
}

export interface LifestyleGetQueueInfoParams {
  queueId: string
}

export interface LifestyleGetQueueStatusParams {
  programId: number
  visitDate: string
}

export interface LifestyleCancelQueueRequest {
  queueId: string
}

// ============================================
// Response Types
// ============================================

export type LifestyleJoinQueueResponse = BaseResponse<LifestyleQueueInfo>

export type LifestyleGetQueueInfoResponse = BaseResponse<LifestyleQueueInfo>

export type LifestyleGetQueueStatusResponse = BaseResponse<LifestyleQueueStatus>

export type LifestyleCancelQueueResponse = BaseResponse<{ success: boolean }>
