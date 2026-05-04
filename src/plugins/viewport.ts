import { config } from '@/config'

const VIEWPORT = {
  default: 'width=device-width, initial-scale=1.0',
  noZoom:
    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover',
}

export function setupViewport() {
  const viewport = document.querySelector('meta[name="viewport"]')
  if (!viewport) return

  const disableZoom = config.ui.mode !== 'browser'
  viewport.setAttribute('content', disableZoom ? VIEWPORT.noZoom : VIEWPORT.default)
}
