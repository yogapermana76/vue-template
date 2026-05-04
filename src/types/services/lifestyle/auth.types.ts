/**
 * Lifestyle Auth Types
 * Types for authentication in Lifestyle API
 */

import type { BaseResponse } from '@/types/common/base.types'

// ============================================
// Auth Request Types
// ============================================

export interface LifestyleLoginBasicRequest {
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

export interface LifestyleValidateSecurityCodeRequest {
  securityCode: string
  phoneNumber: string
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

export interface LifestyleSemiLoginRequest {
  token: string
}

// ============================================
// Auth Response Types
// ============================================

export interface LifestyleUserProfile {
  name: string
  id: number
  username: string
  email: string
  lastLogin: string
  avatar: {
    large: string
    medium: string
    original: string
    small: string
    thumb: string
  }
  createdAt: string
  phone: string
  isActivated: boolean
  isVerifiedEmail: boolean
  isVerifiedPhone: boolean
  verificationStatus: string
  isVerified: boolean
}

export interface LifestyleLoginBasicData {
  refreshToken: string
  refreshTokenExpiresMins: number
  accessToken: string
  accessTokenType: string
  accessTokenExpiresSec: number
}

export interface LifestyleSemiLoginUser {
  id: number
  fullname: string
  email: string
  phoneNumber: string
  plnmUserId: number
  isActive: boolean
  isVerifiedEmail: boolean
  isVerifiedPhone: boolean
}

export interface LifestyleSemiLoginData {
  token: string
  tokenType: string
  expiredDate: number
  user: LifestyleSemiLoginUser
  msg: string | null
}

// Response Types
export type LifestyleLoginBasicResponse = BaseResponse<LifestyleLoginBasicData>
export type LifestyleUserProfileResponse = BaseResponse<LifestyleUserProfile>
export type LifestyleSemiLoginResponse = {
  code: string
  message: string
  data: LifestyleSemiLoginData
}
export type LifestyleValidateSecurityCodeResponse = BaseResponse<unknown>
