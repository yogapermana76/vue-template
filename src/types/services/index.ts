/**
 * Services Types
 * Business domain types for various modules
 */

// Auth
export type {
  User,
  UserProfile,
  SyncAccountRequest,
  LoginBasicRequest,
  AuthData,
  LoginBasicData,
  SyncAccountResponse,
  LoginBasicResponse,
  UserProfileResponse,
  LegacyAuthResponse,
  AuthState,
  AuthQueryParams,
} from './auth.types'

// Point
export type {
  PointSummary,
  PointSummaryResponse,
  PointHistoryItem,
  PointHistoryData,
  PointHistoryResponse,
  PointDetail,
  PointDetailResponse,
  PointHistoryParams,
  PointDetailParams,
  // Composable Params
  UsePointSummaryParams,
  UsePointHistoryParams,
  UsePointHistoryInfiniteParams,
  UsePointDetailParams,
} from './point.types'

// Lottery
export type {
  LotteryTermsCondition,
  Lottery,
  LotteryDetail,
  UserLottery,
  UserLotteryDetail,
  LotteryRedeemRequest,
  LotteryRedeemResult,
  LotteryRedeemResponse,
  LotteryRedeemablePagesResponse,
  LotteryDetailResponse,
  LotteryPromoResponse,
  UserLotteryListResponse,
  UserLotteryDetailResponse,
  LotteryRedeemablePagesParams,
  LotteryDetailParams,
  LotteryPromoParams,
  UserLotteryListParams,
  UserLotteryDetailParams,
  // Composable Params
  UseLotteryRedeemablePagesParams,
  UseLotteryDetailParams,
  UseLotteryPromoParams,
  UseUserLotteryListParams,
  UseUserLotteryDetailParams,
} from './lottery.types'

// Reward
export type {
  Reward,
  RewardCategory,
  RewardDetail,
  GiftInstantly,
  UserGiftInstantly,
  UserGiftInstantlyDetail,
  LastAddress,
  ExchangeRequest,
  ExchangeResult,
  ExchangeResponse,
  RewardGiftInstantlyResponse,
  RewardRedeemableResponse,
  RewardDetailResponse,
  RewardCategoryResponse,
  UserGiftInstantlyResponse,
  UserGiftInstantlyDetailResponse,
  LastAddressResponse,
  RewardPagesParams,
  RewardDetailParams,
  UserGiftInstantlyParams,
  UserGiftInstantlyDetailParams,
  // Composable Params
  UseRewardGiftInstantlyParams,
  UseRewardRedeemableParams,
  UseRewardRedeemableDetailParams,
  UseRewardGiftInstantlyDetailParams,
  UseUserGiftInstantlyParams,
  UseUserGiftInstantlyDetailParams,
} from './reward.types'

// Voucher
export type {
  Voucher,
  VoucherCategory,
  VoucherDetail,
  VoucherPagesResponse,
  VoucherDetailResponse,
  VoucherCategoryResponse,
  VoucherPagesParams,
  VoucherDetailParams,
  // Composable Params
  UseVoucherPagesParams,
  UseVoucherDetailParams,
} from './voucher.types'

// Region
export type {
  Province,
  City,
  District,
  ProvinceListResponse,
  CityListResponse,
  DistrictListResponse,
  CityParams,
  DistrictParams,
  // Composable Params
  UseProvincesParams,
  UseCitiesParams,
  UseDistrictsParams,
} from './region.types'

// Winner
export type {
  Winner,
  WinnerTnc,
  WinnersData,
  WinnersResponse,
  WinnerTncResponse as WinnerTncListResponse,
  WinnersParams,
  WinnerCategoryParams,
  // Composable Params
  UseWinnerListParams,
  UseWinnerListInfiniteParams,
  UseWinnerCategoriesParams,
  UseWinnerTncParams,
} from './winner.types'

// Public
export type {
  FYIItem,
  FYIResponse,
  FAQItem,
  FAQResponse,
  WinnerCategory,
  WinnerCategoryResponse,
  WinnerTncParams,
  // Composable Params
  UseFYIParams,
  UseFAQParams,
  UseWinnersCategoryParams,
  UsePublicWinnerTncParams,
} from './public.types'
