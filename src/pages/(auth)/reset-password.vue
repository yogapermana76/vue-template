<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useForm, Field } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { Button } from '@/components/ui/button'
  import { PasswordField } from '@/components/ui/form'
  import {
    AuthCard,
    AuthLink,
    AuthSuccessState,
    passwordConfirmSchema,
    PasswordStrength,
    useAuthReset,
  } from '@/features/auth'

  definePage({ path: '/reset-password', name: 'ResetPasswordPage' })

  const route = useRoute()
  const reset = useAuthReset()

  // Token is normally in the URL from the reset email link.
  const token = computed(() => (route.query.token as string | undefined) ?? '')

  const schema = toTypedSchema(passwordConfirmSchema())

  const { handleSubmit, values } = useForm({
    validationSchema: schema,
    initialValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = handleSubmit(async v => {
    await reset.submit(token.value, v.password)
  })
</script>

<template>
  <AuthCard
    v-if="!reset.success.value"
    title="Set a new password"
    subtitle="Your new password must be different from any previous ones."
  >
    <form class="flex flex-col gap-5" @submit="onSubmit">
      <Field v-slot="{ field, errorMessage }" name="password">
        <PasswordField
          id="password"
          v-bind="field"
          label="New password"
          placeholder="At least 8 characters"
          :error="errorMessage"
          :disabled="reset.submitting.value"
        />
      </Field>

      <PasswordStrength :password="values.password ?? ''" />

      <Field v-slot="{ field, errorMessage }" name="confirmPassword">
        <PasswordField
          id="confirmPassword"
          v-bind="field"
          label="Confirm new password"
          placeholder="Retype your new password"
          :error="errorMessage"
          :disabled="reset.submitting.value"
        />
      </Field>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        class="mt-1 w-full"
        :loading="reset.submitting.value"
      >
        Reset password
      </Button>
    </form>

    <template #footer>
      Back to
      <AuthLink to="/login">Sign in</AuthLink>
    </template>
  </AuthCard>

  <AuthCard v-else title="Password updated">
    <AuthSuccessState
      title="You're all set"
      description="Your password has been reset successfully. Sign in with your new password."
    >
      <RouterLink to="/login" class="w-full">
        <Button variant="primary" size="lg" class="w-full">Sign in</Button>
      </RouterLink>
    </AuthSuccessState>
  </AuthCard>
</template>
