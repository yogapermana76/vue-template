export interface ForgotPasswordValues {
  email: string
}

export interface ResetPasswordValues {
  password: string
  confirmPassword: string
}

export interface RegisterValues {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}

export type PasswordStrength = 0 | 1 | 2 | 3 | 4
