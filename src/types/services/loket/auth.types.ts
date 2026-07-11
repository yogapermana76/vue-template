/**
 * Loket Auth Types
 * Shapes match the real Loket API response body (see /v2/auth/login).
 */

import type { BaseResponse } from '@/types/common/base.types'

// ============================================
// Request Types
// ============================================

export interface LoketLoginRequest {
  Email: string
  Password: string
}

export interface LoketRefreshTokenRequest {
  refreshToken: string
}

// ============================================
// Response Types
// ============================================

export interface LoketUserData {
  FullName: string
  Email?: string
}

export interface LoketRoleData {
  ID: number
  Name: string
}

export interface LoketPermissionData {
  PermissionID: number
  Ctx: string
  ModuleID: number
  ModuleName: string
  RoleID: number
  PermissionName: string
  PermissionCode: string
}

export interface LoketLoginData {
  AccessToken: string
  RefreshToken: string
  User: LoketUserData
  Role: LoketRoleData
  Permission: LoketPermissionData[]
}

export type LoketLoginResponse = BaseResponse<LoketLoginData>
export type LoketRefreshTokenResponse = BaseResponse<{ AccessToken: string; RefreshToken: string }>
