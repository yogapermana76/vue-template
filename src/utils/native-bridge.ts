/**
 * Native Bridge Utilities for WebView Communication
 *
 * Provides a unified interface for communication between web and native mobile apps.
 * Automatically detects and uses the appropriate bridge for each platform.
 *
 * Supported platforms:
 * - Flutter WebView (FlutterChannel)
 * - React Native (ReactNativeWebView)
 * - iOS WKWebView (webkit.messageHandlers)
 * - Android WebView (Android interface)
 *
 * @example
 * // Set status bar
 * setStatusBar({ style: 'dark', backgroundColor: '#ffffff' })
 *
 * @example
 * // Navigate to deeplink
 * openDeeplink('loket://rewards/123')
 *
 * @example
 * // Get safe area insets
 * const insets = getSafeAreaInsets()
 * console.log(insets.top) // 44 on iPhone with notch
 */

// Constants
const CSS_ENV_SAFE_AREA_TOP = 'env(safe-area-inset-top)'
const DEV_MODE = import.meta.env.DEV

// iOS webkit handler names to try
const WEBKIT_HANDLERS = ['bridge', 'statusBar', 'navigation'] as const

// Android interface names to try
const ANDROID_INTERFACES = ['Android', 'AndroidBridge', 'NativeBridge'] as const

/**
 * Status bar style configuration
 */
export interface StatusBarConfig {
  /** Icon style: 'light' = white icons, 'dark' = black icons, 'default' = system */
  style: 'light' | 'dark' | 'default'
  /** Background color in hex format (e.g., '#ffffff') */
  backgroundColor?: string
  /** Whether status bar should be translucent (Android only) */
  translucent?: boolean
}

/**
 * Safe area insets (in pixels)
 */
export interface SafeAreaInsets {
  /** Top inset (notch, status bar) */
  top: number
  /** Bottom inset (home indicator) */
  bottom: number
  /** Left inset (safe area padding) */
  left: number
  /** Right inset (safe area padding) */
  right: number
}

/**
 * Navigate to deeplink URL
 * Attempts to use native bridge if available, falls back to direct navigation
 */
export function openDeeplink(url: string): void {
  if (!url) return

  try {
    // Try native bridges first
    if (sendMessageToNative({ action: 'navigate', url })) {
      return
    }

    // Fallback to direct navigation
    window.location.href = url
  } catch (error) {
    console.error('[NativeBridge] Navigation failed:', error)
  }
}

/**
 * Set status bar appearance
 *
 * Controls status bar color and icon style (light/dark).
 * Works across all platforms and updates fallback meta tags for PWA/browser.
 *
 * @param config - Status bar configuration
 *
 * @example
 * // White background with dark icons (for light pages)
 * setStatusBar({ style: 'dark', backgroundColor: '#ffffff' })
 *
 * @example
 * // Dark background with light icons (for dark pages)
 * setStatusBar({ style: 'light', backgroundColor: '#0f172b' })
 *
 * @example
 * // Transparent with white icons (for gradient headers)
 * setStatusBar({ style: 'light', backgroundColor: 'transparent' })
 */
export function setStatusBar(config: StatusBarConfig): void {
  try {
    // Send to native app via bridge
    sendMessageToNative({
      action: 'setStatusBar',
      ...config,
    })

    // Update PWA/browser fallback meta tags
    if (config.backgroundColor) {
      updateThemeColorMeta(config.backgroundColor)
    }
    updateAppleStatusBarStyle(config.style)

    // Emit custom event for testing tools (development only)
    if (DEV_MODE) {
      window.dispatchEvent(
        new CustomEvent('statusbar:change', {
          detail: config,
        }),
      )
    }
  } catch (error) {
    console.error('[NativeBridge] Failed to set status bar:', error)
  }
}

/**
 * Get safe area insets from native app
 *
 * Returns the safe area insets (notch, home indicator, etc.) in pixels.
 * Tries multiple methods in order of preference:
 * 1. CSS environment variables (iOS, requires viewport-fit=cover)
 * 2. Window-injected values from native app
 * 3. Default zeros if not available
 *
 * @returns Safe area insets in pixels, or zeros if not in WebView
 *
 * @example
 * const insets = getSafeAreaInsets()
 * const paddingTop = `${insets.top}px`
 */
export function getSafeAreaInsets(): SafeAreaInsets {
  try {
    // Method 1: Try CSS environment variables (iOS Safari, requires viewport-fit=cover)
    if (CSS.supports('padding-top', CSS_ENV_SAFE_AREA_TOP)) {
      const style = getComputedStyle(document.documentElement)
      return {
        top: parseInt(style.getPropertyValue('env(safe-area-inset-top)')) || 0,
        bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)')) || 0,
        left: parseInt(style.getPropertyValue('env(safe-area-inset-left)')) || 0,
        right: parseInt(style.getPropertyValue('env(safe-area-inset-right)')) || 0,
      }
    }

    // Method 2: Try window-injected values from native app
    if (window.__SAFE_AREA_INSETS__) {
      return window.__SAFE_AREA_INSETS__
    }
  } catch (error) {
    console.warn('[NativeBridge] Failed to get safe area insets:', error)
  }

  // Method 3: Default to zeros (not in WebView or not supported)
  return { top: 0, bottom: 0, left: 0, right: 0 }
}

/**
 * Send message to native app via available bridge
 *
 * Automatically detects and uses the appropriate bridge for the current platform.
 * Tries bridges in order of specificity and returns true if message was sent.
 *
 * @param message - Message object to send to native app
 * @returns true if message was sent successfully, false otherwise
 *
 * Priority order:
 * 1. Flutter WebView (FlutterChannel)
 * 2. React Native (ReactNativeWebView)
 * 3. iOS WKWebView (webkit.messageHandlers)
 * 4. Android WebView (Android interface)
 */
function sendMessageToNative(message: Record<string, unknown>): boolean {
  try {
    // 1. Flutter WebView (preferred for Flutter apps)
    if (window.FlutterChannel?.postMessage) {
      window.FlutterChannel.postMessage(JSON.stringify(message))
      return true
    }

    // 2. React Native WebView
    if (window.ReactNativeWebView?.postMessage) {
      window.ReactNativeWebView.postMessage(JSON.stringify(message))
      return true
    }

    // 3. iOS WKWebView - try multiple handler names
    if (window.webkit?.messageHandlers) {
      for (const handlerName of WEBKIT_HANDLERS) {
        const handler = window.webkit.messageHandlers[handlerName]
        if (handler) {
          handler.postMessage(message)
          return true
        }
      }
    }

    // 4. Android WebView - try multiple interface names
    for (const interfaceName of ANDROID_INTERFACES) {
      const androidInterface = (window as unknown as Record<string, unknown>)[interfaceName]
      if (
        androidInterface &&
        typeof androidInterface === 'object' &&
        'postMessage' in androidInterface
      ) {
        const postMessage = (androidInterface as { postMessage: (msg: string) => void }).postMessage
        if (typeof postMessage === 'function') {
          postMessage(JSON.stringify(message))
          return true
        }
      }
    }
  } catch (error) {
    console.warn('[NativeBridge] Failed to send message:', error)
  }

  return false
}

/**
 * Update theme-color meta tag
 *
 * Sets the browser chrome color for PWAs and Android Chrome.
 * Preserves existing theme-color tags with media queries (light/dark mode support).
 * Adds a dynamic override tag without media query for runtime updates.
 *
 * @param color - Hex color string (e.g., '#ffffff')
 */
function updateThemeColorMeta(color: string): void {
  const metaName = 'theme-color'

  // Look for existing dynamic theme-color (no media attribute)
  let dynamicMeta = document.querySelector<HTMLMetaElement>(`meta[name="${metaName}"]:not([media])`)

  if (!dynamicMeta) {
    // Create new dynamic meta tag (will override media query tags)
    dynamicMeta = document.createElement('meta')
    dynamicMeta.name = metaName

    // Insert at the end so it takes precedence over media query tags
    document.head.appendChild(dynamicMeta)
  }

  dynamicMeta.content = color
}

/**
 * Update apple-mobile-web-app-status-bar-style meta tag
 *
 * Controls iOS Safari status bar appearance in standalone (PWA) mode.
 * Maps our style values to Apple's format.
 *
 * @param style - Status bar style ('light', 'dark', or 'default')
 */
function updateAppleStatusBarStyle(style: StatusBarConfig['style']): void {
  const metaName = 'apple-mobile-web-app-status-bar-style'
  let meta = document.querySelector<HTMLMetaElement>(`meta[name="${metaName}"]`)

  if (!meta) {
    meta = document.createElement('meta')
    meta.name = metaName
    document.head.appendChild(meta)
  }

  // Map our style to Apple's values:
  // 'light' (white icons) → 'black-translucent' (translucent black bar)
  // 'dark' (black icons) → 'default' (white bar)
  // 'default' → 'default'
  meta.content = style === 'light' ? 'black-translucent' : 'default'
}
