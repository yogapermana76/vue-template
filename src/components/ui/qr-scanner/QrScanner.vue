<script setup lang="ts">
  import { ref, computed, watch, type HTMLAttributes } from 'vue'
  import { QrcodeStream } from 'vue-qrcode-reader'
  import { QrCode } from 'lucide-vue-next'
  import { cn } from '@/utils/cn'
  import { useResponsiveMaxWidth } from '@/composables/ui'
  import { Header } from '@/components/layout'

  /** Default error messages for camera errors */
  const DEFAULT_ERROR_MESSAGES: Record<string, string> = {
    NotAllowedError: 'Camera permission denied. Please allow camera access.',
    NotFoundError: 'No camera found on this device.',
    NotSupportedError: 'This page must be accessed via HTTPS.',
    NotReadableError: 'Camera is being used by another application.',
    OverconstrainedError: 'Camera does not support the requested configuration.',
    default: 'An error occurred while accessing the camera.',
  }

  interface Props {
    /** Whether the scanner is open */
    open: boolean
    /** Instruction text shown at the bottom */
    instructionText?: string
    /** Loading text shown while camera initializes */
    loadingText?: string
    /** Custom error messages (keyed by error name) */
    errorMessages?: Record<string, string>
    /** Custom class for the container */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<Props>(), {
    instructionText: 'Scan the QR code provided',
    loadingText: 'Loading camera...',
  })

  const emit = defineEmits<{
    'update:open': [value: boolean]
    detect: [value: string]
    error: [value: Error]
  }>()

  // State
  const isLoading = ref(true)
  const errorMessage = ref<string | null>(null)

  // Computed - v-model pattern for open state
  const isOpen = computed({
    get: () => props.open,
    set: value => emit('update:open', value),
  })

  // Reset state when scanner opens
  watch(
    () => props.open,
    newValue => {
      if (newValue) {
        isLoading.value = true
        errorMessage.value = null
      }
    },
  )

  // Close the scanner
  const handleClose = () => {
    isOpen.value = false
  }

  // Handle QR code detection
  const onDetect = (detectedCodes: { rawValue: string }[]) => {
    if (detectedCodes.length > 0) {
      const result = detectedCodes[0].rawValue
      emit('detect', result)
    }
  }

  // Camera successfully initialized
  const onCameraOn = () => {
    isLoading.value = false
    errorMessage.value = null
  }

  // Camera turned off
  const onCameraOff = () => {
    isLoading.value = true
  }

  // Get error message from props or defaults
  const getErrorMessage = (errorName: string): string => {
    // Check custom error messages first
    if (props.errorMessages?.[errorName]) {
      return props.errorMessages[errorName]
    }
    // Fall back to defaults
    return DEFAULT_ERROR_MESSAGES[errorName] || DEFAULT_ERROR_MESSAGES.default
  }

  // Handle camera errors with user-friendly messages
  const onError = (error: Error) => {
    isLoading.value = false
    errorMessage.value = getErrorMessage(error.name)
    emit('error', error)
  }

  const { responsiveMaxWidthStyle } = useResponsiveMaxWidth()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      leave-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <!-- Fullscreen overlay background -->
      <div v-if="isOpen" class="fixed inset-0 z-100 bg-neutral-900">
        <!-- Centered container with max-width -->
        <div
          :class="cn('relative mx-auto h-full w-full', props.class)"
          :style="responsiveMaxWidthStyle"
          data-slot="qr-scanner"
        >
          <!-- Header with Close Button -->
          <Header transparent positioning="fixed" back-icon="x" :on-back="handleClose" />

          <!-- Camera Stream Container -->
          <div class="flex h-full flex-col items-center justify-center px-4">
            <!-- Scanner Frame -->
            <div class="relative aspect-square w-full max-w-82">
              <!-- Corner Frames -->
              <div class="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
                <!-- Top Left Corner -->
                <div
                  class="absolute top-0 left-0 size-18 rounded-tl-2xl border-t border-l border-white"
                />
                <!-- Top Right Corner -->
                <div
                  class="absolute top-0 right-0 size-18 rounded-tr-2xl border-t border-r border-white"
                />
                <!-- Bottom Left Corner -->
                <div
                  class="absolute bottom-0 left-0 size-18 rounded-bl-2xl border-b border-l border-white"
                />
                <!-- Bottom Right Corner -->
                <div
                  class="absolute right-0 bottom-0 size-18 rounded-br-2xl border-r border-b border-white"
                />
              </div>

              <!-- QR Code Stream -->
              <QrcodeStream
                class="size-full overflow-hidden rounded-2xl"
                @detect="onDetect"
                @camera-on="onCameraOn"
                @camera-off="onCameraOff"
                @error="onError"
              >
                <!-- Loading State -->
                <div
                  v-if="isLoading && !errorMessage"
                  class="flex size-full items-center justify-center bg-neutral-300"
                >
                  <div class="flex flex-col items-center gap-3">
                    <div
                      class="size-8 animate-spin rounded-full border-2 border-white border-t-transparent"
                    />
                    <span class="body-caption text-white">{{ loadingText }}</span>
                  </div>
                </div>

                <!-- Error State -->
                <div
                  v-if="errorMessage"
                  class="flex size-full items-center justify-center bg-neutral-300 p-6"
                >
                  <div class="flex flex-col items-center gap-3 text-center">
                    <QrCode class="size-12 text-white/60" />
                    <span class="body-caption text-white">{{ errorMessage }}</span>
                  </div>
                </div>
              </QrcodeStream>
            </div>

            <!-- Instruction Section -->
            <div class="mt-16 flex flex-col items-center gap-3">
              <!-- QR Icon -->
              <QrCode class="size-6 text-white" />
              <!-- Instruction Text -->
              <p class="body-m max-w-70 text-center text-white">
                {{ instructionText }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
