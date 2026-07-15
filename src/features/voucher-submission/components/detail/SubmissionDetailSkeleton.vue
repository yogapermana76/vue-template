<script setup lang="ts">
  import { Skeleton } from '@/components/ui/skeleton'
</script>

<template>
  <div class="flex flex-col gap-5" aria-busy="true" aria-live="polite">
    <div class="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
      <!-- Identity card -->
      <aside
        class="bg-card shadow-card relative min-w-0 overflow-hidden rounded-lg border border-neutral-200"
      >
        <div
          class="from-primary-50 via-primary-50/70 relative overflow-hidden bg-linear-to-br to-white px-5 py-5"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex min-w-0 flex-col gap-2">
              <Skeleton class="h-3 w-24" />
              <Skeleton class="h-6 w-28 rounded-full" />
            </div>
            <div class="flex flex-col items-end gap-2">
              <Skeleton class="h-3 w-20" />
              <Skeleton class="h-5 w-40" />
              <Skeleton class="h-3 w-32" />
            </div>
          </div>
        </div>

        <dl class="grid gap-4 px-5 py-5 sm:grid-cols-2">
          <div v-for="i in 4" :key="i" class="flex items-start gap-3">
            <Skeleton class="size-8 rounded-md" />
            <div class="flex min-w-0 flex-1 flex-col gap-1.5">
              <Skeleton class="h-3 w-16" />
              <Skeleton class="h-4 w-3/4" />
            </div>
          </div>
        </dl>
      </aside>

      <!-- Quantities card -->
      <section
        class="bg-card shadow-card flex min-w-0 flex-col overflow-hidden rounded-lg border border-neutral-200"
      >
        <div
          class="from-primary-50 to-background border-b border-neutral-200 bg-linear-to-b px-5 py-4"
        >
          <div class="flex items-center gap-3">
            <Skeleton class="size-8 rounded-md" />
            <div class="flex flex-col gap-1.5">
              <Skeleton class="h-4 w-32" />
              <Skeleton class="h-3 w-48" />
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-3 px-5 py-4">
          <div v-for="i in 3" :key="i" class="flex items-center justify-between gap-4">
            <div class="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton class="h-4 w-1/3" />
              <Skeleton class="h-3 w-1/4" />
            </div>
            <Skeleton class="h-9 w-28 rounded-md" />
          </div>
        </div>
        <div class="flex items-center justify-end gap-2 bg-neutral-50/50 px-5 py-3">
          <Skeleton class="h-10 w-24 rounded-md" />
          <Skeleton class="h-10 w-24 rounded-md" />
        </div>
      </section>
    </div>

    <!-- Voucher table -->
    <section
      class="bg-card shadow-card flex min-w-0 flex-col overflow-hidden rounded-lg border border-neutral-200"
    >
      <div class="flex items-center justify-between gap-3 px-5 py-4">
        <div class="flex items-center gap-3">
          <Skeleton class="size-8 rounded-md" />
          <div class="flex flex-col gap-1.5">
            <Skeleton class="h-4 w-32" />
            <Skeleton class="h-3 w-52" />
          </div>
        </div>
        <Skeleton class="h-6 w-24 rounded-full" />
      </div>
      <div class="flex flex-col gap-2 px-5 py-4">
        <Skeleton v-for="i in 4" :key="i" class="h-10 w-full rounded-md" />
      </div>
    </section>
  </div>
</template>
