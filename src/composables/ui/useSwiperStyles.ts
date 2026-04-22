let stylesLoaded = false

export function useSwiperStyles() {
  if (!stylesLoaded) {
    import('swiper/css')
    import('swiper/css/pagination')
    import('swiper/css/autoplay')
    stylesLoaded = true
  }
}
