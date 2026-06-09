import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export interface BreadcrumbItem {
  label: string
  to?: string
}

export function useBreadcrumb() {
  const route = useRoute()
  const router = useRouter()

  const breadcrumbs = computed<BreadcrumbItem[]>(() => {
    // Check if route meta has custom breadcrumbs array
    const customBreadcrumbs = route.meta.breadcrumbs as BreadcrumbItem[] | undefined

    if (customBreadcrumbs && Array.isArray(customBreadcrumbs)) {
      // Use custom breadcrumbs from meta
      return customBreadcrumbs
    }

    // Fallback to auto-generated breadcrumbs
    const paths = route.path.split('/').filter(Boolean)
    const items: BreadcrumbItem[] = []

    // Build breadcrumbs from path segments
    let currentPath = ''
    paths.forEach((segment, index) => {
      currentPath += `/${segment}`

      // Try to find the route for this path to get its meta
      const matchedRoute = router.resolve(currentPath)
      const customLabel = matchedRoute.meta.breadcrumb as string | undefined

      // Use custom label from route meta if available, otherwise capitalize segment
      const label =
        customLabel ||
        segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')

      // Last item is the current page (no link)
      if (index === paths.length - 1) {
        items.push({ label })
      } else {
        items.push({ label, to: currentPath })
      }
    })

    return items
  })

  return {
    breadcrumbs,
  }
}
