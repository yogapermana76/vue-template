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
  ExchangePointAddress,
  ExchangePointDetail,
  VerifyInfoData,
  RewardGiftInstantlyResponse,
  RewardRedeemableResponse,
  RewardDetailResponse,
  RewardCategoryResponse,
  UserGiftInstantlyResponse,
  UserGiftInstantlyDetailResponse,
  LastAddressResponse,
  ExchangePointDetailResponse,
  VerifyInfoResponse,
  RewardPagesParams,
  RewardDetailParams,
  UserGiftInstantlyParams,
  UserGiftInstantlyDetailParams,
  ExchangePointDetailParams,
  // Composable Params
  UseRewardGiftInstantlyParams,
  UseRewardRedeemableParams,
  UseRewardRedeemableDetailParams,
  UseRewardGiftInstantlyDetailParams,
  UseUserGiftInstantlyParams,
  UseUserGiftInstantlyDetailParams,
  UseExchangePointDetailParams,
  UseVerifyInfoParams,
} from './reward.types'

// Voucher
export type {
  Voucher,
  VoucherCategory,
  VoucherDetail,
  VoucherCodeDetail,
  VoucherPagesResponse,
  VoucherDetailResponse,
  VoucherCodesResponse,
  VoucherCategoryResponse,
  VoucherPagesParams,
  VoucherDetailParams,
  VoucherDetailsPagesParams,
  // Composable Params
  UseVoucherPagesParams,
  UseVoucherDetailParams,
  UseVoucherDetailsPagesParams,
  UseVoucherCategoriesParams,
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
