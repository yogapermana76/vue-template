/**
 * Utility functions for detecting if app is running in a mobile webview
 */

// Type definitions for native bridge objects
interface WindowWithNativeBridge extends Window {
  ReactNativeWebView?: unknown
  webkit?: {
    messageHandlers?: unknown
  }
  Android?: unknown
  NativeApp?: unknown
}

// Type definition for iOS standalone PWA
interface NavigatorStandalone extends Navigator {
  standalone?: boolean
}

/**
 * Detects if the app is running inside a native mobile app webview
 *
 * Detection methods (in order of reliability):
 * 1. Check for injected JavaScript objects from native app (most reliable)
 * 2. Check for Android WebView user agent marker 'wv'
 * 3. Check for in-app browser user agents (Facebook, Instagram, Line, etc.)
 *
 * @returns true if running in native app webview, false if in regular browser
 */
export function isNativeApp(): boolean {
  const ua = navigator.userAgent
  const win = window as WindowWithNativeBridge

  // Method 1: Check for injected objects from native app
  // This is the MOST RELIABLE method - native apps inject these objects
  if (
    typeof win.ReactNativeWebView !== 'undefined' || // React Native WebView
    typeof win.webkit?.messageHandlers !== 'undefined' || // iOS WKWebView
    typeof win.Android !== 'undefined' || // Android WebView with custom interface
    typeof win.NativeApp !== 'undefined' // Custom native app interface
  ) {
    return true
  }

  // Method 2: Android WebView user agent marker
  // Android WebView adds 'wv' to user agent string
  // Example: "... Chrome/91.0.4472.120 Mobile Safari/537.36 wv"
  if (/wv\)/.test(ua)) {
    return true
  }

  // Method 3: Check for in-app browsers (social media apps)
  // These are technically webviews embedded in apps
  const inAppBrowsers = [
    'FBAN', // Facebook App
    'FBAV', // Facebook App
    'Instagram', // Instagram App
    'Line', // Line App
    'MicroMessenger', // WeChat
    'TwitterAndroid', // Twitter Android
    'Puffin', // Puffin Browser (uses server-side rendering)
  ]

  if (inAppBrowsers.some(browser => ua.includes(browser))) {
    return true
  }

  return false
}

/**
 * Detects if running in a standalone PWA (installed on home screen)
 */
export function isStandalonePWA(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as NavigatorStandalone).standalone === true
  )
}

/**
 * Gets the native app platform (ios, android, or null if not native app)
 */
export function getNativeAppPlatform(): 'ios' | 'android' | null {
  if (!isNativeApp()) return null

  const ua = navigator.userAgent.toLowerCase()
  if (/iphone|ipod|ipad/.test(ua)) return 'ios'
  if (/android/.test(ua)) return 'android'

  return null
}

/**
 * Comprehensive detection of app environment
 */
export function detectEnvironment() {
  return {
    isNativeApp: isNativeApp(),
    isStandalone: isStandalonePWA(),
    platform: getNativeAppPlatform(),
    userAgent: navigator.userAgent,
  }
}
