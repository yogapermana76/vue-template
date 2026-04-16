/**
 * Base Types
 * Common types used across the application
 */

// ============================================
// Base Response Types
// ============================================

/**
 * Standard API response wrapper
 */
export interface BaseResponse<T = unknown> {
  success: boolean
  message: string | null
  code: string
  data: T
  time?: string
}

/**
 * Legacy response format (without success field)
 */
export interface LegacyResponse<T = unknown> {
  code: string
  msg: string | null
  data: T
}

// ============================================
// Pagination Types
// ============================================

export interface PaginationParams {
  page?: number
  size?: number
}

export interface PaginatedData<T> {
  data: T[]
  total?: number
  page?: number
  size?: number
}

export type PaginatedResponse<T> = BaseResponse<PaginatedData<T>>

// ============================================
// Common Field Types
// ============================================

export interface ReceivedInfo {
  fullname: string
  email?: string
  noHp: string
}

export interface AddressInfo {
  provinceId: number
  provinceName: string
  cityId: number
  cityName: string
  districtId: number
  districtName: string
  address: string
  postalCode: string
}

export interface FullAddress extends AddressInfo {
  receivedInfo: ReceivedInfo
}

// ============================================
// Utility Types
// ============================================

export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type MaybeRef<T> = T | import('vue').Ref<T>

// ============================================
// Base Composable Parameter Types
// ============================================

/**
 * Base query parameters for pagination
 * Common query string params used across composables
 */
export interface BaseQueryParams {
  /** Page number (default: 0) */
  page?: MaybeRef<number>
  /** Items per page (default: 10) */
  size?: MaybeRef<number>
}

/**
 * Base options for TanStack Query overrides
 * Manually defined to ensure type compatibility with useQuery
 */
export interface BaseQueryOptions {
  /** Whether the query should be enabled */
  enabled?: MaybeRef<boolean>
  /** Time in ms after data is considered stale (default: 0) */
  staleTime?: number
  /** Time in ms that unused/inactive cache data remains in memory (default: 5 minutes) */
  gcTime?: number
  /** Refetch on window focus (default: true) */
  refetchOnWindowFocus?: boolean | 'always'
  /** Refetch on mount (default: true) */
  refetchOnMount?: boolean | 'always'
  /** Refetch on reconnect (default: true) */
  refetchOnReconnect?: boolean | 'always'
  /** Number of retry attempts (default: 3) */
  retry?: boolean | number
  /** Delay between retries in ms */
  retryDelay?: number | ((attemptIndex: number) => number)
}

/**
 * Helper type to omit never properties from object
 * Makes the resulting type cleaner without never fields
 */
type OmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K]
}

/**
 * Empty object marker for pagination-only queries
 * Use this instead of Record<string, never> which is too restrictive
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PaginationOnly {}

/**
 * Check if type has any keys (non-empty object)
 */
type HasKeys<T> = keyof T extends never ? false : true

/**
 * Build query type - includes pagination if TQuery is provided
 */
type BuildQueryType<TQuery> = [TQuery] extends [never]
  ? never
  : HasKeys<TQuery> extends true
    ? BaseQueryParams & TQuery
    : BaseQueryParams

/**
 * Base composable parameters structure
 * All groups are optional - use only what you need
 * Generic defaults to never, so you only need to specify what you use
 *
 * @example
 * // With additional query params only (pagination included automatically)
 * type UseUserListParams = BaseComposableParams<{ status?: MaybeRef<string> }>
 *
 * @example
 * // With path params only
 * type UseUserDetailParams = BaseComposableParams<never, { id?: MaybeRef<string> }>
 *
 * @example
 * // With body for mutations
 * type UseCreateUserParams = BaseComposableParams<never, never, { name: string }>
 *
 * @example
 * // Query params with options override
 * type UseUserListParams = BaseComposableParams<{ status?: MaybeRef<string> }>
 * // Usage: useUserList({ query: { status }, options: { enabled: false } })
 */
export type BaseComposableParams<TQuery = never, TParams = never, TBody = never> =
  OmitNever<{
    /** Query string parameters (pagination, filters) */
    query: BuildQueryType<TQuery>
    /** Path parameters (id, slug) */
    params: TParams
    /** Request body (for mutations) */
    body: TBody
    /** TanStack Query options overrides */
    options: BaseQueryOptions
  }> extends infer R
    ? { [K in keyof R]?: R[K] }
    : never
