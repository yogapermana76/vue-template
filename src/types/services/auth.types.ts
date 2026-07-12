/**
 * Auth Types
 * Shapes match the real API response body (see /v2/auth/login).
 */

import type { BaseResponse } from '@/types/common/base.types'

// ============================================
// Request Types
// ============================================

export interface LoginRequest {
  Email: string
  Password: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

// ============================================
// Response Types
// ============================================

export interface UserData {
  FullName: string
  Email?: string
}

export interface RoleData {
  ID: number
  Name: string
}

export interface PermissionData {
  PermissionID: number
  Ctx: string
  ModuleID: number
  ModuleName: string
  RoleID: number
  PermissionName: string
  PermissionCode: string
}

export interface LoginData {
  AccessToken: string
  RefreshToken: string
  User: UserData
  Role: RoleData
  Permission: PermissionData[]
}

export type LoginResponse = BaseResponse<LoginData>
export type RefreshTokenResponse = BaseResponse<{ AccessToken: string; RefreshToken: string }>
export type LogoutResponse = BaseResponse<Record<string, never>>
