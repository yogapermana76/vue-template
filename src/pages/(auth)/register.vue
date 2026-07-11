<script setup lang="ts">
  import { useForm, Field } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { z } from 'zod'
  import { Mail, User } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { Checkbox } from '@/components/ui/checkbox'
  import { TextField, PasswordField } from '@/components/ui/form'
  import {
    AuthCard,
    AuthLink,
    AuthSuccessState,
    matchPasswords,
    passwordAndConfirmFields,
    PasswordStrength,
    useAuthRegister,
  } from '@/features/auth'

  definePage({ path: '/register', name: 'RegisterPage' })

  const register = useAuthRegister()

  const schema = toTypedSchema(
    z
      .object({
        fullName: z.string().min(1, 'Name is required').min(2, 'Name is too short'),
        email: z.string().min(1, 'Email is required').email('Invalid email address'),
        ...passwordAndConfirmFields(),
        agreeTerms: z.boolean().refine(v => v, 'You must accept the terms to continue'),
      })
      .refine(matchPasswords.check, matchPasswords.options),
  )

  const { handleSubmit, values } = useForm({
    validationSchema: schema,
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
  })

  const onSubmit = handleSubmit(async v => {
    await register.submit(v)
  })
</script>

<template>
  <AuthCard
    v-if="!register.success.value"
    title="Create your account"
    subtitle="Get started with a free workspace in seconds."
    width="lg"
  >
    <form class="flex flex-col gap-5" @submit="onSubmit">
      <Field v-slot="{ field, errorMessage }" name="fullName">
        <TextField
          id="fullName"
          v-bind="field"
          label="Full name"
          placeholder="Your name"
          :prefix-icon="User"
          :error="errorMessage"
          :disabled="register.submitting.value"
        />
      </Field>

      <Field v-slot="{ field, errorMessage }" name="email">
        <TextField
          id="email"
          v-bind="field"
          label="Work email"
          type="email"
          placeholder="you@company.com"
          :prefix-icon="Mail"
          :error="errorMessage"
          :disabled="register.submitting.value"
        />
      </Field>

      <Field v-slot="{ field, errorMessage }" name="password">
        <PasswordField
          id="password"
          v-bind="field"
          label="Password"
          placeholder="At least 8 characters"
          :error="errorMessage"
          :disabled="register.submitting.value"
        />
      </Field>

      <PasswordStrength :password="values.password ?? ''" />

      <Field v-slot="{ field, errorMessage }" name="confirmPassword">
        <PasswordField
          id="confirmPassword"
          v-bind="field"
          label="Confirm password"
          placeholder="Retype your password"
          :error="errorMessage"
          :disabled="register.submitting.value"
        />
      </Field>

      <Field v-slot="{ handleChange, errorMessage, value }" name="agreeTerms" type="checkbox">
        <div class="flex flex-col gap-1">
          <label class="flex cursor-pointer items-start gap-2.5">
            <Checkbox :checked="value === true" class="mt-0.5" @update:checked="handleChange" />
            <span class="body-caption text-neutral-600">
              I agree to the
              <a class="text-primary-700 hover:underline" href="#">Terms of Service</a>
              and
              <a class="text-primary-700 hover:underline" href="#">Privacy Policy</a>.
            </span>
          </label>
          <p v-if="errorMessage" class="body-caption text-error-600 pl-8">
            {{ errorMessage }}
          </p>
        </div>
      </Field>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        class="mt-1 w-full"
        :loading="register.submitting.value"
      >
        Create account
      </Button>
    </form>

    <template #footer>
      Already have an account?
      <AuthLink to="/login">Sign in</AuthLink>
    </template>
  </AuthCard>

  <AuthCard v-else title="Almost there">
    <AuthSuccessState
      title="Verify your email"
      description="We sent you a verification link. Click it to activate your account and sign in."
    >
      <RouterLink to="/login" class="w-full">
        <Button variant="primary" size="lg" class="w-full">Continue to sign in</Button>
      </RouterLink>
    </AuthSuccessState>
  </AuthCard>
</template>
