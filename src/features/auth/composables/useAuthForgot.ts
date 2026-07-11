import { ref } from 'vue'
import { extractAuthError } from '../utils/extractAuthError'

/** Mock forgot-password flow. Replace `submit()` body with a real auth-service call. */
export function useAuthForgot() {
  const submitting = ref(false)
  const submittedEmail = ref<string | null>(null)
  const error = ref<string | null>(null)

  const submit = async (email: string) => {
    submitting.value = true
    error.value = null
    try {
      await new Promise(r => setTimeout(r, 700))
      submittedEmail.value = email
    } catch (e) {
      error.value = extractAuthError(e, 'Failed to send reset link')
    } finally {
      submitting.value = false
    }
  }

  const reset = () => {
    submittedEmail.value = null
    error.value = null
  }

  return { submitting, submittedEmail, error, submit, reset }
}
