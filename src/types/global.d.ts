/**
 * Global type declarations for external integrations and native bridges
 */

import type { SafeAreaInsets } from '@/utils/native-bridge'

/**
 * Native bridge interfaces for mobile WebView communication
 *
 * These interfaces are injected by native apps (Flutter, React Native, iOS, Android)
 * to enable bidirectional communication between web and native layers.
 */
declare global {
  interface Window {
    /** React Native WebView bridge */
    ReactNativeWebView?: {
      postMessage: (message: string) => void
    }

    /** iOS WKWebView bridge */
    webkit?: {
      messageHandlers?: {
        [key: string]: {
          postMessage: (message: Record<string, unknown>) => void
        }
      }
    }

    /** Flutter WebView JavaScript Channel */
    FlutterChannel?: {
      postMessage: (message: string) => void
    }

    /** Safe area insets injected by native app */
    __SAFE_AREA_INSETS__?: SafeAreaInsets
  }
}

export {}
