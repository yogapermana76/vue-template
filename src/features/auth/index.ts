export * from './types'
export * from './constants'

export { useAuthForgot } from './composables/useAuthForgot'
export { useAuthReset } from './composables/useAuthReset'
export { useAuthRegister } from './composables/useAuthRegister'
export { useAuthRedirect } from './composables/useAuthRedirect'

export { default as AuthCard } from './components/AuthCard.vue'
export { default as AuthLink } from './components/AuthLink.vue'
export { default as LoginCarousel } from './components/LoginCarousel.vue'
export { default as PasswordStrength } from './components/PasswordStrength.vue'
export { default as AuthSuccessState } from './components/AuthSuccessState.vue'

export { extractAuthError } from './utils/extractAuthError'
export {
  passwordAndConfirmFields,
  matchPasswords,
  passwordConfirmSchema,
} from './utils/passwordSchema'
