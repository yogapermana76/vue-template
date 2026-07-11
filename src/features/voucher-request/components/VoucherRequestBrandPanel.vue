<script setup lang="ts">
  import plnLogo from '@/assets/images/pln-mobile-logo.png'
  import { Image } from '@/components/ui/image'

  withDefaults(
    defineProps<{
      lines?: string[]
      year?: string
      tagline?: string
    }>(),
    {
      lines: () => ['PLN', 'ELECTRIC', 'RUN'],
      year: '2026',
      tagline: 'Bersama melangkah,\nenergi untuk negeri.',
    },
  )
</script>

<template>
  <!-- Fixed sidebar; consumer must reserve matching left space in the main column. -->
  <aside
    class="fixed top-0 left-0 z-10 hidden h-screen w-64 overflow-hidden bg-[linear-gradient(to_bottom,#eaf5fa_0%,#ffffff_16%)] lg:flex lg:flex-col"
    aria-label="PLN Electric Run 2026"
  >
    <div class="pt-5 pl-5.5">
      <slot name="logo">
        <Image
          :src="plnLogo"
          alt="PLN Mobile"
          loading-strategy="skeleton"
          aspect-ratio="square"
          container-class="size-[60px] shrink-0"
        />
      </slot>
    </div>

    <div class="mt-23 ml-7 w-51">
      <h1 class="text-[30px] leading-[1.06] font-extrabold tracking-tight italic">
        <span
          class="block bg-[linear-gradient(180deg,#36aeb4_0%,#2c90cb_58%,#184f74_100%)] bg-clip-text text-transparent"
        >
          <span v-for="line in lines" :key="line" class="block">{{ line }}</span>
        </span>
        <span class="block text-slate-800">{{ year }}</span>
      </h1>
    </div>

    <p class="body-m mt-4.5 ml-7.5 whitespace-pre-line text-slate-600">
      {{ tagline }}
    </p>

    <!-- Elastic spacer keeps the illustration pinned to the bottom. -->
    <div class="min-h-4 flex-1" aria-hidden="true" />

    <div class="mt-auto">
      <slot name="illustration">
        <svg
          class="pointer-events-none block w-full select-none"
          viewBox="0 0 256 340"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="vrbp-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#eaf5fa" stop-opacity="0" />
              <stop offset="1" stop-color="#d9eef8" />
            </linearGradient>
            <linearGradient id="vrbp-road" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#2c90cb" />
              <stop offset="0.55" stop-color="#36aeb4" />
              <stop offset="1" stop-color="#4ebec2" />
            </linearGradient>
          </defs>

          <!-- sky wash -->
          <rect y="20" width="256" height="180" fill="url(#vrbp-sky)" />

          <!-- skyline -->
          <g opacity="0.5">
            <rect x="10" y="78" width="26" height="100" rx="4" fill="#c3e0f4" />
            <rect x="42" y="52" width="32" height="126" rx="4" fill="#e4f0fa" />
            <rect x="80" y="90" width="22" height="88" rx="4" fill="#c3e0f4" />
            <rect x="148" y="64" width="30" height="114" rx="4" fill="#e4f0fa" />
            <rect x="184" y="86" width="24" height="92" rx="4" fill="#c3e0f4" />
            <rect x="214" y="56" width="30" height="122" rx="4" fill="#e4f0fa" />
            <g fill="#8fc8ea" opacity="0.55">
              <rect x="48" y="64" width="6" height="6" rx="1" />
              <rect x="60" y="64" width="6" height="6" rx="1" />
              <rect x="48" y="78" width="6" height="6" rx="1" />
              <rect x="60" y="78" width="6" height="6" rx="1" />
              <rect x="154" y="76" width="6" height="6" rx="1" />
              <rect x="166" y="76" width="6" height="6" rx="1" />
              <rect x="154" y="90" width="6" height="6" rx="1" />
              <rect x="166" y="90" width="6" height="6" rx="1" />
              <rect x="220" y="68" width="6" height="6" rx="1" />
              <rect x="232" y="68" width="6" height="6" rx="1" />
              <rect x="220" y="82" width="6" height="6" rx="1" />
              <rect x="232" y="82" width="6" height="6" rx="1" />
            </g>
          </g>

          <!-- grass band -->
          <path
            d="M-10 196 C 70 178, 190 178, 266 198 L 266 250 L -10 250 Z"
            fill="#b8e9e9"
            opacity="0.7"
          />

          <!-- trees & bushes -->
          <g>
            <rect x="22" y="168" width="6" height="26" rx="3" fill="#2a6b74" />
            <circle cx="25" cy="152" r="22" fill="#4ebec2" />
            <circle cx="14" cy="162" r="13" fill="#86d8da" />
          </g>
          <g>
            <rect x="226" y="172" width="6" height="24" rx="3" fill="#2a6b74" />
            <circle cx="229" cy="156" r="19" fill="#36aeb4" />
            <circle cx="240" cy="166" r="11" fill="#86d8da" />
          </g>
          <circle cx="206" cy="196" r="14" fill="#86d8da" />
          <circle cx="222" cy="202" r="10" fill="#4ebec2" />
          <circle cx="44" cy="198" r="12" fill="#86d8da" />

          <!-- road -->
          <path
            d="M-10 236 C 70 208, 176 220, 266 292 L 266 340 L -10 340 Z"
            fill="url(#vrbp-road)"
          />
          <path
            d="M-10 262 C 70 236, 176 248, 266 316"
            stroke="#ffffff"
            stroke-width="3"
            stroke-dasharray="14 12"
            opacity="0.6"
          />

          <!-- white swoosh corner -->
          <path d="M96 340 C 150 306, 210 296, 266 306 L 266 340 Z" fill="#f8fafc" />
          <path
            d="M96 340 C 150 306, 210 296, 266 306"
            stroke="#b8e9e9"
            stroke-width="6"
            opacity="0.9"
          />

          <!-- shadows -->
          <ellipse cx="96" cy="258" rx="36" ry="6" fill="#153037" opacity="0.16" />
          <ellipse cx="178" cy="266" rx="38" ry="6.5" fill="#153037" opacity="0.16" />

          <!-- motion lines -->
          <g stroke="#4ebec2" stroke-width="3" stroke-linecap="round" opacity="0.55">
            <path d="M34 208 L 52 208" />
            <path d="M28 220 L 44 220" />
            <path d="M128 182 L 144 182" />
          </g>

          <!-- Female runner (left, behind) -->
          <g stroke-linecap="round">
            <path d="M97 178 L 111 189 L 119 177" stroke="#cf8f6e" stroke-width="6.5" fill="none" />
            <path d="M88 205 L 72 224 L 60 210" stroke="#141c30" stroke-width="8.5" fill="none" />
            <ellipse
              cx="55"
              cy="205"
              rx="7.5"
              ry="4"
              transform="rotate(-38 55 205)"
              fill="#dbe4ee"
            />
            <path d="M90 204 L 99 176" stroke="#36aeb4" stroke-width="17" fill="none" />
            <circle cx="90" cy="205" r="8.5" fill="#1d293d" />
            <path d="M92 205 L 110 227 L 116 251" stroke="#1d293d" stroke-width="9" fill="none" />
            <ellipse
              cx="121"
              cy="254"
              rx="8"
              ry="4.5"
              transform="rotate(12 121 254)"
              fill="#f8fafc"
            />
            <path d="M114 257 L 128 260" stroke="#36aeb4" stroke-width="2.5" />
            <path d="M100 172 L 102 166" stroke="#e8a887" stroke-width="5" />
            <ellipse
              cx="88"
              cy="150"
              rx="9.5"
              ry="4.5"
              transform="rotate(-18 88 150)"
              fill="#3b2a1e"
            />
            <ellipse cx="79" cy="147" rx="5" ry="3" transform="rotate(-18 79 147)" fill="#3b2a1e" />
            <circle cx="103" cy="157" r="10" fill="#3b2a1e" />
            <circle cx="105.5" cy="159.5" r="8.5" fill="#e8a887" />
            <path d="M99 178 L 85 191 L 76 180" stroke="#e8a887" stroke-width="6.5" fill="none" />
            <circle cx="99" cy="179" r="5.5" fill="#2d848d" />
          </g>

          <!-- Male runner (right, front) -->
          <g stroke-linecap="round">
            <path d="M180 180 L 168 194 L 160 183" stroke="#d1926a" stroke-width="7" fill="none" />
            <path
              d="M174 210 L 196 230 L 202 256"
              stroke="#d1926a"
              stroke-width="8.5"
              fill="none"
            />
            <ellipse
              cx="207"
              cy="259"
              rx="8.5"
              ry="4.5"
              transform="rotate(12 207 259)"
              fill="#dbe4ee"
            />
            <path d="M174 210 L 187 222" stroke="#141c30" stroke-width="12" />
            <path d="M177 208 L 186 178" stroke="#2269ee" stroke-width="19" fill="none" />
            <circle cx="177" cy="209" r="9.5" fill="#1d293d" />
            <path d="M179 209 L 161 231 L 147 219" stroke="#e8b08e" stroke-width="9" fill="none" />
            <ellipse
              cx="141"
              cy="214"
              rx="8"
              ry="4.5"
              transform="rotate(-36 141 214)"
              fill="#f8fafc"
            />
            <path d="M136 210 L 146 219" stroke="#195d8b" stroke-width="2.5" />
            <path d="M179 209 L 167 223" stroke="#1d293d" stroke-width="12" />
            <path d="M187 174 L 189 168" stroke="#e8b08e" stroke-width="6" />
            <circle cx="191" cy="158" r="10.5" fill="#1d293d" />
            <circle cx="193.5" cy="160.5" r="8.8" fill="#e8b08e" />
            <path d="M186 181 L 201 191 L 210 180" stroke="#e8b08e" stroke-width="7" fill="none" />
            <circle cx="186" cy="181" r="6.5" fill="#1a53db" />
          </g>
        </svg>
      </slot>
    </div>
  </aside>
</template>
