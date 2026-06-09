<script setup lang="ts">
  import { computed } from 'vue'
  import { RouterLink } from 'vue-router'
  import { ChevronRight } from 'lucide-vue-next'
  import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
  } from '@/components/ui/breadcrumb'
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu'
  import { useBreadcrumb } from '@/composables/ui'

  const { breadcrumbs } = useBreadcrumb()

  // For tablet with ellipsis: show first, ellipsis (middle items), last
  const firstItem = computed(() => breadcrumbs.value[0])
  const middleItems = computed(() => breadcrumbs.value.slice(1, -1))
  const hasMiddleItems = computed(() => middleItems.value.length > 0)
  const currentPage = computed(() => breadcrumbs.value[breadcrumbs.value.length - 1])
</script>

<template>
  <Breadcrumb v-if="breadcrumbs.length > 0" class="min-w-0">
    <!-- Mobile: Horizontal scroll with smaller text -->
    <div class="scrollbar-none max-w-full overflow-x-auto sm:hidden">
      <BreadcrumbList class="flex-nowrap">
        <template v-for="(item, index) in breadcrumbs" :key="index">
          <BreadcrumbItem class="whitespace-nowrap">
            <BreadcrumbLink v-if="item.to" as-child>
              <RouterLink :to="item.to" class="text-xs">
                {{ item.label }}
              </RouterLink>
            </BreadcrumbLink>
            <BreadcrumbPage v-else class="text-xs">
              {{ item.label }}
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator v-if="index < breadcrumbs.length - 1">
            <ChevronRight class="h-3 w-3" />
          </BreadcrumbSeparator>
        </template>
      </BreadcrumbList>
    </div>

    <!-- Tablet: Show with ellipsis if more than 2 items -->
    <BreadcrumbList class="hidden sm:flex lg:hidden" v-if="breadcrumbs.length > 2">
      <!-- First item -->
      <BreadcrumbItem>
        <BreadcrumbLink v-if="firstItem?.to" as-child>
          <RouterLink :to="firstItem.to" class="max-w-25 truncate">
            {{ firstItem.label }}
          </RouterLink>
        </BreadcrumbLink>
        <BreadcrumbPage v-else class="max-w-25 truncate">
          {{ firstItem?.label }}
        </BreadcrumbPage>
      </BreadcrumbItem>

      <!-- Ellipsis with dropdown for middle items -->
      <template v-if="hasMiddleItems">
        <BreadcrumbSeparator>
          <ChevronRight class="h-4 w-4" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger class="flex items-center gap-1">
              <BreadcrumbEllipsis class="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem v-for="(item, index) in middleItems" :key="index" as-child>
                <RouterLink v-if="item.to" :to="item.to" class="cursor-pointer">
                  {{ item.label }}
                </RouterLink>
                <span v-else>{{ item.label }}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
      </template>

      <!-- Current page -->
      <BreadcrumbSeparator>
        <ChevronRight class="h-4 w-4" />
      </BreadcrumbSeparator>
      <BreadcrumbItem>
        <BreadcrumbPage class="max-w-37.5 truncate">
          {{ currentPage?.label }}
        </BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>

    <!-- Tablet: Show all if 2 or less items -->
    <BreadcrumbList class="hidden sm:flex lg:hidden" v-else>
      <template v-for="(item, index) in breadcrumbs" :key="index">
        <BreadcrumbItem>
          <BreadcrumbLink v-if="item.to" as-child>
            <RouterLink :to="item.to" class="max-w-30 truncate">
              {{ item.label }}
            </RouterLink>
          </BreadcrumbLink>
          <BreadcrumbPage v-else class="max-w-37.5 truncate">
            {{ item.label }}
          </BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="index < breadcrumbs.length - 1">
          <ChevronRight class="h-4 w-4" />
        </BreadcrumbSeparator>
      </template>
    </BreadcrumbList>

    <!-- Desktop: Show all items with overflow scroll -->
    <div class="scrollbar-none hidden max-w-full overflow-x-auto lg:block">
      <BreadcrumbList class="flex-nowrap">
        <template v-for="(item, index) in breadcrumbs" :key="index">
          <BreadcrumbItem class="whitespace-nowrap">
            <BreadcrumbLink v-if="item.to" as-child>
              <RouterLink :to="item.to">
                {{ item.label }}
              </RouterLink>
            </BreadcrumbLink>
            <BreadcrumbPage v-else>
              {{ item.label }}
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator v-if="index < breadcrumbs.length - 1">
            <ChevronRight class="h-4 w-4" />
          </BreadcrumbSeparator>
        </template>
      </BreadcrumbList>
    </div>
  </Breadcrumb>
</template>
