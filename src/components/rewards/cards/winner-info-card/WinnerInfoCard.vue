<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { ArrowRight } from 'lucide-vue-next'
  import TrophyIllustration from '@/assets/illustrations/trophy.svg?component'
  import { cn } from '@/utils/cn'

  export interface WinnerInfoCardProps {
    /** Card title */
    title?: string
    /** Card description */
    description?: string
    /** Additional CSS classes */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<WinnerInfoCardProps>(), {
    title: 'Informasi Pemenang',
    description: 'Undian periode Januari - Maret',
  })

  const emit = defineEmits<{
    click: []
  }>()

  const handleClick = () => {
    emit('click')
  }
</script>

<template>
  <button
    :class="
      cn(
        'relative flex h-16 items-center gap-3 overflow-hidden rounded-sm bg-[linear-gradient(135deg,#1AB6BE_0%,#0E6AA7_100%)] px-4',
        props.class,
      )
    "
    @click="handleClick"
  >
    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Decorative circle left -->
      <div
        class="absolute top-1/2 -left-19 size-37.5 -translate-y-1/2 rounded-full border-2 border-white/20"
      />
      <div
        class="absolute top-1/2 -left-20 size-37.5 -translate-y-1/2 rounded-full bg-[linear-gradient(131deg,rgba(255,255,255,0.2)_-8%,transparent_18%,rgba(255,255,255,0.4)_44%,transparent_66%,rgba(255,255,255,0.7)_80%,transparent_103%)] opacity-20"
      />
      <!-- Decorative PLN lightning bolts right -->
      <svg
        class="absolute top-1/2 right-14 -translate-y-1/2"
        width="76"
        height="124"
        viewBox="0 0 76 124"
        fill="none"
      >
        <path
          opacity="0.2"
          d="M74.0292 56.1191L24.3121 106.416C24.1933 106.537 24.0678 106.651 23.936 106.758L23.5367 107.02C23.1108 107.275 22.6322 107.427 22.1389 107.463C21.6457 107.499 21.1513 107.419 20.6952 107.228C20.2602 107.068 19.8628 106.82 19.5276 106.498C19.1923 106.177 18.9265 105.789 18.7463 105.359C18.5662 104.929 18.4757 104.466 18.4804 103.999C18.485 103.531 18.5848 103.069 18.7735 102.641L30.7075 73.7583L33.8724 66.11C34.1191 65.5242 34.2383 64.8924 34.2219 64.2574C34.2055 63.6223 34.0538 62.9988 33.7771 62.4291C33.5004 61.8594 33.1053 61.3569 32.6183 60.9555C32.1314 60.5541 31.5641 60.2633 30.9549 60.1027L3.28217 53.043C2.66686 52.8797 2.09434 52.5843 1.60371 52.177C1.11308 51.7697 0.715907 51.2601 0.439308 50.683C0.16271 50.1059 0.0132043 49.4748 0.00100712 48.833C-0.0111901 48.1911 0.114203 47.5536 0.368627 46.9639L28.9694 -11.3444C29.8095 -13.0342 31.1925 -14.389 32.8921 -15.1869C34.5918 -15.9848 36.5074 -16.1787 38.3253 -15.7368L67.5852 -8.27219C68.4972 -8.02912 69.3402 -7.5764 70.0481 -6.94943C70.7561 -6.32246 71.3098 -5.53826 71.6659 -4.65818C72.0221 -3.77809 72.171 -2.82601 72.101 -1.87641C72.0311 -0.926813 71.7441 -0.00546162 71.2627 0.815556L50.2917 37.0882C49.936 37.6944 49.7242 38.3749 49.6731 39.0762C49.6219 39.7776 49.7328 40.4806 49.9969 41.1301C50.2611 41.7796 50.6713 42.3578 51.1954 42.8193C51.7196 43.2809 52.3433 43.6131 53.0175 43.79L72.0086 48.6349C72.7676 48.8268 73.4617 49.2185 74.0198 49.7699C74.578 50.3214 74.9804 51.0129 75.1858 51.7739C75.3913 52.5349 75.3925 53.3381 75.1892 54.1015C74.986 54.8649 74.5857 55.5611 74.0292 56.1191Z"
          fill="url(#paint0_linear_lightning1)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_lightning1"
            x1="-17.7052"
            y1="3.22882"
            x2="83.8222"
            y2="94.6996"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" stop-opacity="0.2" />
            <stop offset="0.235577" stop-color="white" stop-opacity="0" />
            <stop offset="0.471154" stop-color="white" stop-opacity="0.4" />
            <stop offset="0.668269" stop-color="white" stop-opacity="0" />
            <stop offset="0.79916" stop-color="white" stop-opacity="0.7" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <svg
        class="absolute top-1/2 right-10 -translate-y-1/2"
        width="67"
        height="110"
        viewBox="0 0 67 110"
        fill="none"
      >
        <path
          d="M59.6495 -6.24973L59.921 -6.16837C60.5482 -5.9614 61.1282 -5.62853 61.6252 -5.18837C62.1931 -4.6854 62.6377 -4.05616 62.9238 -3.34935C63.21 -2.64222 63.3296 -1.87614 63.2733 -1.11248C63.217 -0.348959 62.9863 0.391664 62.5993 1.05173L62.5976 1.05433L44.051 33.1342C43.6975 33.7365 43.4869 34.4132 43.4361 35.1099C43.3853 35.8066 43.4961 36.5057 43.7588 37.1515C44.0215 37.7972 44.4298 38.373 44.9516 38.8325C45.4733 39.2919 46.0944 39.6231 46.7659 39.7993L63.5677 44.0856C64.1523 44.2334 64.688 44.5347 65.1184 44.96C65.5488 45.3853 65.8589 45.9196 66.0176 46.5076C66.1764 47.0957 66.1773 47.7168 66.0201 48.3073C65.8629 48.8977 65.5532 49.4363 65.1232 49.8674L65.1218 49.869L21.1478 94.356L21.1466 94.3567C21.0598 94.445 20.968 94.5279 20.8723 94.6062L20.5617 94.8122C20.2518 94.9977 19.9033 95.1082 19.5453 95.1344C19.1871 95.1607 18.8283 95.1019 18.4973 94.9638L18.4769 94.9566L18.2427 94.8555C18.0141 94.7434 17.8034 94.5965 17.6183 94.4191C17.3715 94.1823 17.1755 93.8961 17.0426 93.5788C16.9096 93.2615 16.8419 92.9196 16.8453 92.5741C16.8488 92.2285 16.9226 91.8865 17.0622 91.5701L17.0669 91.5593L27.6225 66.0135L30.421 59.2472C30.6657 58.6648 30.785 58.0372 30.7688 57.4059C30.7524 56.7731 30.6008 56.1506 30.3249 55.5824C30.0489 55.0143 29.6542 54.5128 29.1681 54.1121C28.6818 53.7114 28.1155 53.4204 27.5068 53.26L3.03099 47.0158C2.55713 46.89 2.11603 46.6623 1.7379 46.3483C1.35976 46.0344 1.05316 45.6415 0.839605 45.196C0.625999 44.7503 0.510341 44.2625 0.500909 43.7661C0.491573 43.2741 0.586632 42.7853 0.779945 42.3326L26.0704 -9.22877L26.0711 -9.22758C26.7641 -10.6217 27.9048 -11.739 29.3054 -12.3965C30.6183 -13.0128 32.0868 -13.191 33.4983 -12.9112L33.7799 -12.8494L59.6495 -6.24973Z"
          stroke="url(#paint0_linear_lightning2)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_lightning2"
            x1="-15.6599"
            y1="3.43953"
            x2="74.1395"
            y2="84.344"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" stop-opacity="0.2" />
            <stop offset="0.235577" stop-color="white" stop-opacity="0" />
            <stop offset="0.471154" stop-color="white" stop-opacity="0.4" />
            <stop offset="0.668269" stop-color="white" stop-opacity="0" />
            <stop offset="0.79916" stop-color="white" stop-opacity="0.7" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <!-- Yellow glow effect top right -->
      <div
        class="absolute -top-22.5 right-10.75 size-49.25 rounded-full bg-[#F4F07A] opacity-30 blur-3xl"
      />
    </div>

    <!-- Trophy Icon -->
    <div class="relative z-10 flex size-12 shrink-0 items-center justify-center">
      <TrophyIllustration class="size-12" />
    </div>

    <!-- Content -->
    <div class="relative z-10 ml-3 flex flex-1 flex-col items-start gap-0.5">
      <h3 class="body-m-semibold text-white">{{ title }}</h3>
      <p class="body-caption text-white/80">{{ description }}</p>
    </div>

    <!-- Arrow Icon  -->
    <ArrowRight class="size-4 text-white" />
  </button>
</template>
