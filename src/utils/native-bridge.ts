/**
 * Navigation utility for WebView
 * TODO: Coordinate with Flutter team for JavaScript Channel implementation
 */

export function openDeeplink(url: string): void {
  if (!url) return

  try {
    window.location.href = url
  } catch (error) {
    console.error('[Navigation] Failed:', error)
  }
}

/*
 * Uncomment when Flutter JavaScript Channel is ready:
 *
 * export function openDeeplink(url: string): void {
 *   if (!url) return
 *
 *   try {
 *     if (window.FlutterChannel?.postMessage) {
 *       window.FlutterChannel.postMessage(JSON.stringify({ action: 'navigate', url }))
 *       return
 *     }
 *   } catch {}
 *
 *   window.location.href = url
 * }
 */
