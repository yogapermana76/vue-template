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
  /** Custom back handler (e.g., deeplink to mobile app). If not provided, uses router.back() */
  onBack?: () => void
  /** Right-side action buttons */
  rightActions?: HeaderAction[]
  /** Hide theme toggle (default: true) */
  hideThemeToggle?: boolean
  /** Positioning mode: 'fixed' (always visible), 'sticky' (stick to top), 'normal' (scroll with content) */
  positioning?: 'fixed' | 'sticky' | 'normal'
  /** Custom class for back button icon */
  backButtonClass?: string
  /**
   * Enable transparent mode with scroll transition.
   * When enabled, header starts transparent and transitions to solid white on scroll.
   * Also handles text/icon color transitions automatically.
   * @default false
   */
  transparent?: boolean
}

/** Default props */
export const defaultHeaderProps: HeaderProps = {
  title: '',
  showBack: true,
  hideThemeToggle: true,
  positioning: 'fixed',
  rightActions: [],
}

/** Backward compatibility - HeaderConfig is an alias for HeaderProps */
export type HeaderConfig = HeaderProps
export const defaultHeaderConfig = defaultHeaderProps
