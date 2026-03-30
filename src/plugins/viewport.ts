import { config } from '@/config'

export function setupViewport() {
  const viewport = document.querySelector('meta[name="viewport"]')
  if (!viewport) return

  if (config.ui.mode === 'webview') {
    viewport.setAttribute(
      'content',
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover',
    )
  } else {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0')
  }
}
