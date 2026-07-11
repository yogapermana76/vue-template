<script setup lang="ts">
  import { useForm, Field } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { z } from 'zod'
  import { Mail } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { TextField } from '@/components/ui/form'
  import { AuthCard, AuthLink, AuthSuccessState, useAuthForgot } from '@/features/auth'

  definePage({ path: '/forgot-password', name: 'ForgotPasswordPage' })

  const forgot = useAuthForgot()

  const schema = toTypedSchema(
    z.object({
      email: z.string().min(1, 'Email is required').email('Invalid email address'),
    }),
  )

  const { handleSubmit } = useForm({ validationSchema: schema })

  const onSubmit = handleSubmit(async values => {
    await forgot.submit(values.email)
  })
</script>

<template>
  <AuthCard
    v-if="!forgot.submittedEmail.value"
    title="Forgot password?"
    subtitle="Enter your email and we'll send you a link to reset your password."
  >
    <form class="flex flex-col gap-5" @submit="onSubmit">
      <Field v-slot="{ field, errorMessage }" name="email">
        <TextField
          id="email"
          v-bind="field"
          label="Email"
          type="email"
          placeholder="you@example.com"
          :prefix-icon="Mail"
          :error="errorMessage ?? forgot.error.value ?? undefined"
          :disabled="forgot.submitting.value"
        />
      </Field>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        class="mt-1 w-full"
        :loading="forgot.submitting.value"
      >
        Send reset link
      </Button>
    </form>

    <template #footer>
      Remember your password?
      <AuthLink to="/login">Sign in</AuthLink>
    </template>
  </AuthCard>

  <AuthCard v-else title="Check your inbox">
    <AuthSuccessState
      title="Reset link sent"
      :description="`We've sent instructions to ${forgot.submittedEmail.value}. The link will expire in 30 minutes.`"
    >
      <Button variant="secondary" size="lg" class="w-full" @click="forgot.reset">
        Use a different email
      </Button>
      <RouterLink
        to="/login"
        class="body-caption-semibold text-primary-700 hover:text-primary-800 mt-2 text-center"
      >
        Back to sign in
      </RouterLink>
    </AuthSuccessState>
  </AuthCard>
</template>
