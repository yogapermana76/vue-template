/**
 * Trigger a browser download for a `Blob`. Falls back to opening the
 * object URL when `download` isn't supported.
 */
export function downloadBlob(blob: Blob, filename: string, mime?: string): void {
  const wrapped = mime ? new Blob([blob], { type: mime }) : blob
  const url = URL.createObjectURL(wrapped)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  // Revoke on next tick so Safari has a chance to start the download.
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

export const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
