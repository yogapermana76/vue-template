/**
 * Lifestyle Program API Endpoints
 */
export const LifestyleProgramEndpoint = {
  // Article endpoints
  ARTICLE_NUSANTARA: '/article/nusantara',
  ARTICLE_SEARCH: '/article/search',
  ARTICLE_DETAIL: '/article/detail/:id',

  // Program endpoints
  PROGRAM_DETAIL: '/program/detail',
  PROGRAM_LIST_VISIT_DATE: '/program/list-visit-date',
  PROGRAM_LIST_TICKET_BY_VISIT_DATE: '/program/list-ticket-by-visit-date',
  PROGRAM_DETAIL_TICKET_CATEGORIES: '/program/detail-ticket-categories',
  PROGRAM_CATEGORY_LIST_TICKET: '/program/category-list-ticket',
  PROGRAM_GET_FORM: '/program/get-form',
  PROGRAM_BANNER: '/program/banner',
  PROGRAM_TYPE: '/program/type',
  PROGRAM_RECOMMENDATION: '/program/recommendation',
  PROGRAM_SEARCH: '/program/search',
  PROGRAM_CATEGORY: '/program/category',
  PROGRAM_ATTENDANCE_MODE: '/program/attendance-mode',
  PROGRAM_COUNT: '/program/count',
} as const
