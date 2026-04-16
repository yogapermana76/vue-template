/**
 * Header Configuration Types
 * Centralized types for Header component
 */

/** Action button configuration for header */
export interface HeaderAction {
  /** Unique identifier */
  id: string
  /** Icon name from lucide-vue-next (e.g., 'share-2', 'heart') */
  icon: string
  /** Accessible label/tooltip */
  label?: string
  /** Click handler */
  onClick?: () => void
}

/** Header component props */
export interface HeaderProps {
  /** Page title */
  title?: string
  /** Optional subtitle */
  subtitle?: string
  /** Show back button (default: true) */
  showBack?: boolean
  /** Back button icon: 'arrow-left' or 'x' (default: 'arrow-left') */
  backIcon?: 'arrow-left' | 'x'
  /** Custom back handler (e.g., deeplink to mobile app). If not provided, uses router.back() */
  onBack?: () => void
  /** Right-side action buttons */
  rightActions?: HeaderAction[]
  /** Hide theme toggle (default: true) */
  hideThemeToggle?: boolean
  /** Positioning mode: 'fixed' (always visible), 'sticky' (stick to top), 'static' (scroll with content) */
  positioning?: 'fixed' | 'sticky' | 'static'
  /** Custom class for back button icon */
  backButtonClass?: string
  /**
   * Enable transparent mode with scroll transition.
   * When enabled, header starts transparent and transitions to solid white on scroll.
   * Also handles text/icon color transitions automatically.
   * @default false
   */
  transparent?: boolean
  /**
   * Scroll threshold to trigger header background transition.
   * Only used when `transparent` is true.
   * - Number: pixels (e.g., 100)
   * - String with 'px': pixels (e.g., '100px')
   * - String with '%': percentage of viewport height (e.g., '50%')
   * @default 50
   */
  scrollThreshold?: number | string
}

/** Default props */
export const defaultHeaderProps: HeaderProps = {
  title: '',
  showBack: true,
  backIcon: 'arrow-left',
  hideThemeToggle: true,
  positioning: 'fixed',
  rightActions: [],
}

/** Backward compatibility - HeaderConfig is an alias for HeaderProps */
export type HeaderConfig = HeaderProps
export const defaultHeaderConfig = defaultHeaderProps
