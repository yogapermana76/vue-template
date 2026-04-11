<script setup lang="ts">
  interface Props {
    /**
     * Event title
     */
    title?: string
    /**
     * Event description
     */
    description?: string
  }

  withDefaults(defineProps<Props>(), {
    title: 'Judul Event',
    description:
      'Lorem ipsum dolor sit amet consectetur. Diam aliquet purus sed viverra gravida etiam. Ut vitae sagittis risus a in. Integer odio tellus sed aliquam viverra tempus sit volutpat. Enim cursus feugiat enim faucibus. Diam netus amet vitae etiam nisl. Sed ullamcorper proin purus vitae eget mi. Vitae non luctus laoreet integer dictumst nulla sed. Eget ullamcorper auctor est eleifend neque interdum donec sit magnis. Etiam purus purus purus tristique semper nam.',
  })
</script>

<template>
  <div class="flex flex-col gap-1 px-4">
    <h2 class="body-l-semibold text-neutral-950">{{ title }}</h2>
    <p class="text-xs text-slate-700">{{ description }}</p>
  </div>
</template>
