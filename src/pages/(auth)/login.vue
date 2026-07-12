<script setup lang="ts">
  import { useForm, Field } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { z } from 'zod'
  import { useRouter } from 'vue-router'
  import { Button } from '@/components/ui/button'
  import { TextField, PasswordField } from '@/components/ui/form'
  import { useAuthStore } from '@/stores'
  import { useToast } from '@/composables/ui/useToast'
  import { AuthCard, extractAuthError, useAuthRedirect } from '@/features/auth'

  definePage({ path: '/login', name: 'LoginPage' })

  const router = useRouter()
  const authStore = useAuthStore()
  const toast = useToast()

  const { resolveRedirect } = useAuthRedirect('/dashboard')

  const schema = toTypedSchema(
    z.object({
      email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
      password: z.string().min(1, 'Kata sandi wajib diisi').min(6, 'Kata sandi minimal 6 karakter'),
    }),
  )

  const { handleSubmit, isSubmitting } = useForm({ validationSchema: schema })

  const GENERIC_LOGIN_ERROR = 'Terjadi kesalahan saat login. Silakan coba lagi.'

  const onSubmit = handleSubmit(async values => {
    try {
      const response = await authStore.login({
        Email: values.email,
        Password: values.password,
      })

      // Guard on both success flag AND access token to avoid partial responses.
      const succeeded = response.success !== false && !!response.data?.AccessToken
      if (!succeeded) {
        toast.error({
          title: 'Login gagal',
          description: response.message ?? 'Email atau kata sandi salah.',
        })
        return
      }

      router.push(resolveRedirect())

      toast.success({
        title: 'Selamat datang',
        description: `Anda masuk sebagai ${response.data.User?.FullName ?? 'pengguna'}.`,
      })
    } catch (err) {
      toast.error({
        title: 'Login gagal',
        description: extractAuthError(err, GENERIC_LOGIN_ERROR),
      })
    }
  })
</script>

<template>
  <AuthCard title="Selamat Datang" subtitle="Masuk untuk mengakses Monitoring Loket Event PLN.">
    <form class="flex flex-col gap-5" @submit="onSubmit">
      <Field v-slot="{ field, errorMessage }" name="email">
        <TextField
          id="email"
          v-bind="field"
          label="Email"
          type="email"
          placeholder="nama@pln.co.id"
          autocomplete="email"
          :error="errorMessage"
          :disabled="isSubmitting"
        />
      </Field>

      <Field v-slot="{ field, errorMessage }" name="password">
        <PasswordField
          id="password"
          v-bind="field"
          label="Kata Sandi"
          placeholder="Masukkan kata sandi"
          autocomplete="current-password"
          :error="errorMessage"
          :disabled="isSubmitting"
        />
      </Field>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        class="mt-1 w-full"
        :loading="isSubmitting"
        :disabled="isSubmitting"
      >
        Masuk
      </Button>
    </form>
  </AuthCard>
</template>
