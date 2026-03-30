/**
 * Toast/Notification Composable
 * Wrapper around vue-sonner for consistent API
 * Uses shadcn-vue compatible Sonner component
 */

import { toast } from 'vue-sonner'

export interface ToastOptions {
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * Toast composable using vue-sonner
 * Usage:
 *   const { success, error } = useToast()
 *   success('Operation completed')
 *   error({ title: 'Failed', description: 'Please try again' })
 */
export function useToast() {
  const success = (options: ToastOptions | string) => {
    if (typeof options === 'string') {
      return toast.success(options)
    }
    return toast.success(options.title, {
      description: options.description,
      duration: options.duration,
      action: options.action,
    })
  }

  const error = (options: ToastOptions | string) => {
    if (typeof options === 'string') {
      return toast.error(options)
    }
    return toast.error(options.title, {
      description: options.description,
      duration: options.duration,
      action: options.action,
    })
  }

  const warning = (options: ToastOptions | string) => {
    if (typeof options === 'string') {
      return toast.warning(options)
    }
    return toast.warning(options.title, {
      description: options.description,
      duration: options.duration,
      action: options.action,
    })
  }

  const info = (options: ToastOptions | string) => {
    if (typeof options === 'string') {
      return toast.info(options)
    }
    return toast.info(options.title, {
      description: options.description,
      duration: options.duration,
      action: options.action,
    })
  }

  const loading = (options: ToastOptions | string) => {
    if (typeof options === 'string') {
      return toast.loading(options)
    }
    return toast.loading(options.title, {
      description: options.description,
      duration: options.duration,
    })
  }

  const promise = <T>(
    promiseFn: Promise<T>,
    options: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: unknown) => string)
    },
  ) => {
    return toast.promise(promiseFn, options)
  }

  const dismiss = (toastId?: string | number) => {
    toast.dismiss(toastId)
  }

  return {
    toast, // Raw toast for advanced usage
    success,
    error,
    warning,
    info,
    loading,
    promise,
    dismiss,
  }
}

// Re-export types
export type { ToastOptions as Toast }
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading'
