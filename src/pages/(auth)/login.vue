<script setup lang="ts">
  import { useRouter, useRoute } from 'vue-router'
  import { useForm, Field } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { z } from 'zod'
  import { Loader2 } from 'lucide-vue-next'
  import { useAuth } from '@/composables/auth'
  import { Button } from '@/components/ui/button'
  import { Input } from '@/components/ui/input'
  import { Label } from '@/components/ui/label'
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card'
  import { config } from '@/config'

  definePage({
    meta: {
      title: 'Login',
      guest: true,
    },
  })

  const router = useRouter()
  const route = useRoute()
  const { login, isLoading, error } = useAuth()

  const loginSchema = toTypedSchema(
    z.object({
      email: z.string().min(1, 'Email is required').email('Invalid email format'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
    }),
  )

  const { handleSubmit } = useForm({
    validationSchema: loginSchema,
    initialValues: {
      email: config.features.demoMode ? 'demo@example.com' : '',
      password: config.features.demoMode ? 'password' : '',
    },
  })

  const onSubmit = handleSubmit(async values => {
    const result = await login({
      email: values.email,
      password: values.password,
    })

    if (result.success) {
      const redirect = (route.query.redirect as string) || '/'
      await router.push(redirect)
    }
  })
</script>

<template>
  <div class="bg-background flex min-h-screen items-center justify-center px-4">
    <div class="w-full max-w-md">
      <Card>
        <CardHeader class="text-center">
          <CardTitle class="text-2xl">Welcome back</CardTitle>
          <CardDescription> Enter your credentials to access your account </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit="onSubmit" class="space-y-4">
            <Field name="email" v-slot="{ field, errorMessage }">
              <div class="space-y-2">
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="demo@example.com"
                  v-bind="field"
                  :class="{ 'border-destructive': errorMessage }"
                />
                <p v-if="errorMessage" class="text-destructive text-sm">
                  {{ errorMessage }}
                </p>
              </div>
            </Field>

            <Field name="password" v-slot="{ field, errorMessage }">
              <div class="space-y-2">
                <Label for="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  v-bind="field"
                  :class="{ 'border-destructive': errorMessage }"
                />
                <p v-if="errorMessage" class="text-destructive text-sm">
                  {{ errorMessage }}
                </p>
              </div>
            </Field>

            <div v-if="error" class="text-destructive text-sm">
              {{ error }}
            </div>

            <Button type="submit" class="w-full" :disabled="isLoading">
              <Loader2 v-if="isLoading" class="mr-2 size-4 animate-spin" />
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter v-if="config.features.demoMode" class="flex-col space-y-4">
          <div class="text-muted-foreground text-center text-sm">
            <p>Demo credentials:</p>
            <p>Email: demo@example.com</p>
            <p>Password: password</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
