/**
 * Auth Types
 * Types for authentication and user profile
 */

import type { BaseResponse, LegacyResponse } from '../common/base.types'

// ============================================
// User Entity
// ============================================

export interface User {
  id: number | string
  fullname: string
  email: string
  phoneNumber?: string
  accountUpgraded?: boolean
  created?: string
  updated?: string
}

export interface UserProfile {
  id: number
  name: string
  username: string
  email: string
  phone: string
  last_login: string
  avatar: string | null
  created_at: string
  is_activated: boolean
  is_verified: boolean
  is_verified_email: boolean
  is_verified_phone: boolean
  verification_status: string | null
  verification_status_reason: string | null
  has_iconcash: boolean
  is_validate_email: boolean
  verified_at: string | null
  login_type: string[]
  login_type_latest: string
  can_add_idpel: boolean
  profile: unknown | null
}

// ============================================
// Auth Request Types
// ============================================

export interface SyncAccountRequest {
  token: string
}

export interface LoginBasicRequest {
  email: string
  password: string
  additional: {
    fcmToken: string
    latitude: number
    longitude: number
    deviceName: string
    devicePlatform: string
    devicePlatformVersion: string
    plnMobileVersion: string
    uuid: string
  }
}

// ============================================
// Auth Response Types
// ============================================

export interface AuthData {
  token: string
  tokenType: string
  expiresIn?: number
  expiredDate?: number
  user: User
  msg?: string | null
}

export interface LoginBasicData {
  refreshToken: string
  refreshTokenExpiresMins: number
  accessToken: string
  accessTokenType: string
  accessTokenExpiresSec: number
}

export type SyncAccountResponse = BaseResponse<AuthData>
export type LoginBasicResponse = BaseResponse<LoginBasicData>
export type UserProfileResponse = BaseResponse<UserProfile>

// Legacy response format
export type LegacyAuthResponse = LegacyResponse<AuthData>

// ============================================
// Auth State
// ============================================

export interface AuthState {
  user: User | null
  tokenJwt: string | null
  isAuthenticated: boolean
}

// ============================================
// Query Parameters
// ============================================

export interface AuthQueryParams {
  token: string
  redirect?: string
}
