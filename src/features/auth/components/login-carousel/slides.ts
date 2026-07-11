import slide1 from '@/assets/images/auth-carousel/slide-1.webp'
import slide2 from '@/assets/images/auth-carousel/slide-2.webp'
import slide3 from '@/assets/images/auth-carousel/slide-3.webp'

export interface LoginCarouselSlide {
  image: string
  title: string
  description: string
}

export const LOGIN_CAROUSEL_SLIDES: LoginCarouselSlide[] = [
  {
    image: slide1,
    title: 'Wisata Budaya',
    description:
      'Terdapat lebih dari 10.000 Wisata Budaya saat ini ada di dalam PLN Mobile Lifestyle yang tersebar di seluruh Indonesia',
  },
  {
    image: slide2,
    title: 'Event',
    description:
      'Terdapat lebih dari 1.000 Event saat ini ada di dalam PLN Mobile Lifestyle yang tersebar di seluruh Indonesia',
  },
  {
    image: slide3,
    title: 'Atraksi',
    description:
      'Terdapat lebih dari 2.000 Tempat Atraksi saat ini ada di dalam PLN Mobile Lifestyle yang tersebar di seluruh Indonesia',
  },
]
