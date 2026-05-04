/**
 * Mock Data for Lifestyle Ticket Booking
 * TODO: Remove this file when API integration is ready
 */

import type { ProgramTicketCategory } from '@/components/lifestyle/sections/ticket'
import type { VisitorInfo } from '@/components/lifestyle/sections/order'
import type { DatePickerCardProps } from '@/components/lifestyle/cards/date-picker'
import type { ProgramDetailData, TicketCategory } from '@/types/services/lifestyle/booking.types'

// ============================================================================
// Mock API Responses
// ============================================================================

/**
 * Mock Program Detail - Example with DATE_RANGE type (Event)
 * Matches: /api-v2/program/detail?programId=133
 */
function getMockProgramDetail(programId: string): ProgramDetailData {
  return {
    programId: parseInt(programId) || 133,
    programName: 'Testing Program Event Baru',
    programScheduleCategory: 'DATE_RANGE',
    programScheduleCategoryFlag: 'DATE_RANGE',
    startDatetime: '2026-03-02T10:00:00',
    endDatetime: '2026-04-30T23:00:00',
    contact: [
      {
        name: '',
        type: 'email',
        value: '',
        sortOrder: 1,
      },
    ],
    facilities: [],
    infoSection: null,
    termsAndConditions: '<ul><li>Tidak ada pengembalian atau penukaran tiket...</li></ul>',
    timezone: 'WIB',
    description: '<ul><li>Event description here...</li></ul>',
    programAttendanceMode: 'Offline',
    programCategory: 'E-learning',
    title: 'Testing',
    address: 'Testing11',
    mapsUrl: 'https://share.google/HFOoPK2u8Qe3Xu0ZK',
    imagesUrl: [
      {
        pathUrl:
          'https://stamkp.beyondkwh.id/api/cdn/api/firebase/file/load/Marketplace~users~1775449701e7e7962d-2fe3-429e-a48d-01f19850d7a6.jpeg',
        pathDownload:
          'https://stamkp.beyondkwh.id/api/cdn/api/firebase/file/download/Marketplace~users~1775449701e7e7962d-2fe3-429e-a48d-01f19850d7a6.jpeg',
      },
    ],
    saleTicketStartDatetime: '2026-03-01T10:00:00',
    saleTicketEndDatetime: '2026-04-30T23:00:00',
  }
}

/**
 * Mock Visit Dates - For DATE_RANGE programs
 * Matches: /api-v2/program/list-visit-date?programId=133&programScheduleCategoryFlag=DATE_RANGE
 */
function getMockVisitDates(): string[] {
  return ['2026-04-27', '2026-04-28', '2026-04-29', '2026-04-30']
}

/**
 * Mock Ticket Categories
 * Matches: /api-v2/program/list-ticket-by-visit-date
 */
function getMockTicketCategories(): TicketCategory[] {
  return [
    {
      programTicketCategoryId: 195,
      ticketCategory: 'Testing Custom Code Tiket',
      information: {
        description: '<ul><li>Ticket description...</li></ul>',
        benefitTickets: ['test', 'test 2', 'test 3'],
        validTicketDate: null,
        listEffectiveDay: null,
        ticketRedemption: '<ul><li>Redemption info...</li></ul>',
        listEffectiveDate: null,
        termsAndConditions: '<ul><li>Terms...</li></ul>',
        additionalInformation: ['test 1', 'test 2', 'test 3'],
      },
      discountValue: 0,
      discountCostType: null,
      amountDiscount: 0,
      beforeDiscountPrice: 19000,
      afterDiscount: 19000,
      finalPrice: 19000,
      basePrice: 19000,
      quotaUsed: 7,
      remainingQuota: 1298,
      earliestStartSaleDatetime: '2026-03-01T10:00:00',
      latestEndSaleDatetime: '2026-04-30T23:00:00',
    },
    {
      programTicketCategoryId: 196,
      ticketCategory: 'test voucher tiket dan point',
      information: {
        description: '<p>deskripsi</p>',
        benefitTickets: [],
        validTicketDate: null,
        listEffectiveDay: null,
        ticketRedemption: '<p>deskripsi</p>',
        listEffectiveDate: null,
        termsAndConditions: '<p>deskripsi</p>',
        additionalInformation: [],
      },
      discountValue: 0,
      discountCostType: null,
      amountDiscount: 0,
      beforeDiscountPrice: 20000,
      afterDiscount: 20000,
      finalPrice: 20000,
      basePrice: 20000,
      quotaUsed: 5,
      remainingQuota: 995,
      earliestStartSaleDatetime: '2026-04-01T06:00:00',
      latestEndSaleDatetime: '2026-04-30T23:00:00',
    },
  ]
}

// ============================================================================
// Transform Functions
// ============================================================================

/**
 * Transform API ticket categories to UI ProgramTicketCategory format
 */
function transformTicketCategoriesToTicketTypes(
  categories: TicketCategory[],
): ProgramTicketCategory[] {
  return categories.map(category => ({
    id: String(category.programTicketCategoryId),
    title: category.ticketCategory,
    features: [
      ...category.information.benefitTickets.map(benefit => ({ text: benefit })),
      ...category.information.additionalInformation.map(info => ({ text: info })),
    ],
  }))
}

/**
 * Transform API visit dates to DatePickerCard format
 */
function transformVisitDatesToDatePicker(visitDates: string[]): DatePickerCardProps[] {
  return visitDates.map(dateStr => ({
    date: dateStr,
    available: true,
  }))
}

// ============================================================================
// Public Mock Data Getters
// ============================================================================

export function getMockEventData(eventId: string) {
  const program = getMockProgramDetail(eventId)

  const dateRange =
    program.programScheduleCategory === 'DATE_RANGE' && program.startDatetime && program.endDatetime
      ? `${new Date(program.startDatetime).toLocaleDateString('id-ID')} - ${new Date(program.endDatetime).toLocaleDateString('id-ID')}`
      : 'Daily Event'

  const time =
    program.programScheduleCategory === 'DATE_RANGE' && program.startDatetime && program.endDatetime
      ? `${new Date(program.startDatetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - ${new Date(program.endDatetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} ${program.timezone}`
      : program.schedules?.find(s => s.active)?.startTime
        ? `${program.schedules.find(s => s.active)?.startTime} - ${program.schedules.find(s => s.active)?.endTime} ${program.timezone}`
        : '-'

  return {
    id: program.programId,
    title: program.programName,
    imageSrc: program.imagesUrl[0]?.pathUrl || 'https://via.placeholder.com/100',
    imageUrl: program.imagesUrl[0]?.pathUrl || 'https://picsum.photos/375/187',
    date: dateRange,
    type: program.programCategory,
    dateRange,
    time,
    location: {
      name: program.title,
      address: program.address,
      mapsUrl: program.mapsUrl,
    },
    alertMessage: 'Anda hanya dapat membeli maksimal 5 tiket.',
    description: program.description.replace(/<[^>]*>/g, ''),
    termsAndConditions: program.termsAndConditions,
    programAttendanceMode: program.programAttendanceMode,
    timezone: program.timezone,
    contact: program.contact,
    facilities: program.facilities,
  }
}

export function getMockAvailableDates(): DatePickerCardProps[] {
  const visitDates = getMockVisitDates()
  return transformVisitDatesToDatePicker(visitDates)
}

export function getMockProgramTicketCategories(): ProgramTicketCategory[] {
  const categories = getMockTicketCategories()
  return transformTicketCategoriesToTicketTypes(categories)
}

export function getMockVisitors(): VisitorInfo[] {
  return [
    {
      id: '1',
      name: '',
      email: '',
      phone: '',
      type: 'Dewasa' as const,
    },
    {
      id: '2',
      name: '',
      email: '',
      phone: '',
      type: 'Dewasa' as const,
    },
  ]
}

export function getMockUserData() {
  return {
    name: 'Gita Diaz',
    email: 'gitadiaz@gmail.com',
    phone: '082123456789',
  }
}

export function getMockPricing() {
  const categories = getMockTicketCategories()
  const firstCategory = categories[0]

  return {
    adultPrice: firstCategory?.finalPrice || 19000,
    childPrice: firstCategory?.finalPrice || 19000,
    adminFee: 2500,
  }
}
