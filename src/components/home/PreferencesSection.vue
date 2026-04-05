<script setup lang="ts">
  import { ref } from 'vue'
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
  import { Checkbox } from '@/components/ui/checkbox'
  import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
  import { Switch } from '@/components/ui/switch'
  import { Label } from '@/components/ui/label'
  import { Flag } from '@/components/ui/flag'
  import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
  import { Button } from '@/components/ui/button'
  import { AlertBox } from '@/components/ui/alert'
  import { EmptyState } from '@/components/ui/empty-state'
  import { Divider } from '@/components/ui/divider'
  import MakeSureIllustration from '@/assets/illustrations/make-sure.svg'
  import RiwayatIllustration from '@/assets/illustrations/riwayat.svg'

  const notifications = ref({
    email: true,
    push: false,
    sms: false,
  })

  const newsletter = ref({
    updates: true,
    promotions: false,
    tips: true,
  })

  const theme = ref('system')
  const language = ref('id')

  const settings = ref({
    darkMode: false,
    autoSave: true,
    analytics: true,
    twoFactor: false,
  })
</script>

<template>
  <section class="py-12">
    <div class="px-4">
      <!-- Section header -->
      <div class="mb-8 text-center">
        <h2 class="mb-4 text-2xl font-bold tracking-tight text-neutral-900">
          Customize Your Experience
        </h2>
        <p class="mx-auto max-w-2xl text-lg text-neutral-600">
          Set your preferences to personalize how you interact with our platform.
        </p>
      </div>

      <!-- Cards grid -->
      <div class="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        <!-- Notifications Card (Checkbox) -->
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choose how you want to receive notifications.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center gap-3">
              <Checkbox id="notif-email" v-model:checked="notifications.email" />
              <Label for="notif-email" class="cursor-pointer">Email notifications</Label>
            </div>
            <div class="flex items-center gap-3">
              <Checkbox id="notif-push" v-model:checked="notifications.push" />
              <Label for="notif-push" class="cursor-pointer">Push notifications</Label>
            </div>
            <div class="flex items-center gap-3">
              <Checkbox id="notif-sms" v-model:checked="notifications.sms" disabled />
              <Label for="notif-sms" class="cursor-pointer text-neutral-400"
                >SMS notifications (coming soon)</Label
              >
            </div>
          </CardContent>
        </Card>

        <!-- Newsletter Card (Checkbox) -->
        <Card>
          <CardHeader>
            <CardTitle>Newsletter</CardTitle>
            <CardDescription>Subscribe to topics you're interested in.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center gap-3">
              <Checkbox id="news-updates" v-model:checked="newsletter.updates" />
              <Label for="news-updates" class="cursor-pointer">Product updates</Label>
            </div>
            <div class="flex items-center gap-3">
              <Checkbox id="news-promotions" v-model:checked="newsletter.promotions" />
              <Label for="news-promotions" class="cursor-pointer">Promotions & offers</Label>
            </div>
            <div class="flex items-center gap-3">
              <Checkbox id="news-tips" v-model:checked="newsletter.tips" />
              <Label for="news-tips" class="cursor-pointer">Tips & tutorials</Label>
            </div>
          </CardContent>
        </Card>

        <!-- Theme Card (Radio) -->
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>Select your preferred appearance.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup v-model="theme" class="space-y-3">
              <div class="flex items-center gap-3">
                <RadioGroupItem id="theme-light" value="light" />
                <Label for="theme-light" class="cursor-pointer">Light</Label>
              </div>
              <div class="flex items-center gap-3">
                <RadioGroupItem id="theme-dark" value="dark" />
                <Label for="theme-dark" class="cursor-pointer">Dark</Label>
              </div>
              <div class="flex items-center gap-3">
                <RadioGroupItem id="theme-system" value="system" />
                <Label for="theme-system" class="cursor-pointer">System</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <!-- Language Card (Radio) -->
        <Card>
          <CardHeader>
            <CardTitle>Language</CardTitle>
            <CardDescription>Choose your preferred language.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup v-model="language" class="space-y-3">
              <div class="flex items-center gap-3">
                <RadioGroupItem id="lang-id" value="id" />
                <Label for="lang-id" class="cursor-pointer">Bahasa Indonesia</Label>
              </div>
              <div class="flex items-center gap-3">
                <RadioGroupItem id="lang-en" value="en" />
                <Label for="lang-en" class="cursor-pointer">English</Label>
              </div>
              <div class="flex items-center gap-3">
                <RadioGroupItem id="lang-jp" value="jp" disabled />
                <Label for="lang-jp" class="cursor-pointer text-neutral-400"
                  >Japanese (coming soon)</Label
                >
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <!-- Settings Card (Switch) -->
        <Card class="md:col-span-2">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Toggle features on or off.</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid gap-4 sm:grid-cols-2">
              <div
                class="flex items-center justify-between rounded-lg border border-neutral-200 p-4"
              >
                <div>
                  <Label for="dark-mode" class="cursor-pointer font-medium">Dark Mode</Label>
                  <p class="text-sm text-neutral-500">Enable dark theme</p>
                </div>
                <Switch id="dark-mode" v-model:checked="settings.darkMode" />
              </div>
              <div
                class="flex items-center justify-between rounded-lg border border-neutral-200 p-4"
              >
                <div>
                  <Label for="auto-save" class="cursor-pointer font-medium">Auto Save</Label>
                  <p class="text-sm text-neutral-500">Save changes automatically</p>
                </div>
                <Switch id="auto-save" v-model:checked="settings.autoSave" />
              </div>
              <div
                class="flex items-center justify-between rounded-lg border border-neutral-200 p-4"
              >
                <div>
                  <Label for="analytics" class="cursor-pointer font-medium">Analytics</Label>
                  <p class="text-sm text-neutral-500">Help improve our service</p>
                </div>
                <Switch id="analytics" v-model:checked="settings.analytics" />
              </div>
              <div
                class="flex items-center justify-between rounded-lg border border-neutral-200 p-4"
              >
                <div>
                  <Label for="two-factor" class="cursor-pointer font-medium text-neutral-400"
                    >Two-Factor Auth</Label
                  >
                  <p class="text-sm text-neutral-400">Coming soon</p>
                </div>
                <Switch id="two-factor" v-model:checked="settings.twoFactor" disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Flags Card -->
        <Card class="md:col-span-2">
          <CardHeader>
            <CardTitle>Flags & Labels</CardTitle>
            <CardDescription>Various flag styles for different use cases.</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap items-end gap-4">
              <Flag variant="primary" icon="check">Baru</Flag>
              <Flag variant="danger" icon="discount">-45%</Flag>
              <Flag variant="danger" icon="discount">-12Rb</Flag>
              <Flag variant="success" icon="ticket" pointer>Tersisa 5 Voucher</Flag>
              <Flag variant="success" icon="thumbs-up" pointer>Rekomendasi</Flag>
              <Flag variant="info" pointer>Kendaraan Utama</Flag>
            </div>
          </CardContent>
        </Card>

        <!-- Tooltips Card -->
        <Card class="md:col-span-2">
          <CardHeader>
            <CardTitle>Tooltips</CardTitle>
            <CardDescription>Hover over buttons to see tooltip variants.</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button variant="secondary" size="sm">Default (Top)</Button>
                  </TooltipTrigger>
                  <TooltipContent side="top"> Anda hemat Rp339.000 🥳 </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button variant="secondary" size="sm">Default (Bottom)</Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom"> Anda hemat Rp339.000 🥳 </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button variant="secondary" size="sm">Info (Top)</Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" variant="info">
                    Anda hemat Rp339.000 🥳
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button variant="secondary" size="sm">Info (Bottom)</Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" variant="info">
                    Anda hemat Rp339.000 🥳
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button variant="secondary" size="sm">Info (Left)</Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" variant="info">
                    Anda hemat Rp339.000 🥳
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button variant="secondary" size="sm">Info (Right)</Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" variant="info">
                    Anda hemat Rp339.000 🥳
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>

        <!-- Alerts Card -->
        <Card class="md:col-span-2">
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
            <CardDescription>Various alert styles for different use cases.</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex flex-col gap-3">
              <!-- Info Alert - Title only -->
              <AlertBox variant="info" title="Data terisi otomatis dari profil Anda" />

              <!-- Info Alert - With description -->
              <AlertBox
                variant="info"
                title="Pastikan titik lokasi dan alamat tepat"
                description="Data terisi otomatis dari profil Anda. Pastikan datanya sudah akurat, ya!"
              />

              <!-- Success Alert - Title only -->
              <AlertBox variant="success" title="Pembayaran berhasil dilakukan" />

              <!-- Success Alert - With description -->
              <AlertBox
                variant="success"
                title="Verifikasi akun berhasil"
                description="Akun Anda telah berhasil diverifikasi. Sekarang Anda dapat mengakses semua fitur."
              />

              <!-- Warning Alert - Title only -->
              <AlertBox variant="warning" title="Pastikan titik lokasi dan alamat tepat" />

              <!-- Warning Alert - With description -->
              <AlertBox
                variant="warning"
                title="Pastikan titik lokasi dan alamat tepat"
                description="Petugas akan melakukan pemasangan listrik pada titik lokasi dan alamat yang Anda pilih."
              />

              <!-- Error Alert - Title only -->
              <AlertBox variant="error" title="Terjadi kesalahan pada sistem" />

              <!-- Error Alert - With description -->
              <AlertBox
                variant="error"
                title="Gagal memproses pembayaran"
                description="Silakan periksa koneksi internet Anda dan coba lagi dalam beberapa saat."
              />

              <!-- Info Alert - With custom action (slot) -->
              <AlertBox
                variant="info"
                title="Pastikan titik lokasi dan alamat tepat"
                description="Data terisi otomatis dari profil Anda. Pastikan datanya sudah akurat, ya!"
              >
                <button class="text-primary-700 hover:text-primary-800 mt-2 text-xs font-semibold">
                  Lihat
                </button>
              </AlertBox>
            </div>
          </CardContent>
        </Card>

        <!-- Empty State Card -->
        <Card class="md:col-span-2">
          <CardHeader>
            <CardTitle>Empty State</CardTitle>
            <CardDescription>Various empty state layouts for different use cases.</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex flex-col gap-6">
              <!-- With title, description, and button -->
              <EmptyState
                :image="MakeSureIllustration"
                title="Title"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                class="rounded-lg border border-dashed border-neutral-300 p-6"
              >
                <template #actions>
                  <Button class="w-full">Button</Button>
                </template>
              </EmptyState>

              <!-- With title and button only -->
              <EmptyState
                :image="MakeSureIllustration"
                title="Title"
                class="rounded-lg border border-dashed border-neutral-300 p-6"
              >
                <template #actions>
                  <Button class="w-full">Button</Button>
                </template>
              </EmptyState>

              <!-- With title and description only -->
              <EmptyState
                :image="MakeSureIllustration"
                title="Title"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                class="rounded-lg border border-dashed border-neutral-300 p-6"
              />

              <!-- With title only -->
              <EmptyState
                :image="MakeSureIllustration"
                title="Title"
                class="rounded-lg border border-dashed border-neutral-300 p-6"
              />

              <!-- With two buttons -->
              <EmptyState
                :image="MakeSureIllustration"
                title="Title"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                class="rounded-lg border border-dashed border-neutral-300 p-6"
              >
                <template #actions>
                  <div class="flex w-full gap-3">
                    <Button variant="secondary" class="flex-1">Button</Button>
                    <Button class="flex-1">Button</Button>
                  </div>
                </template>
              </EmptyState>

              <!-- With Riwayat illustration -->
              <EmptyState
                :image="RiwayatIllustration"
                title="Belum Ada Riwayat"
                description="Riwayat transaksi Anda akan muncul di sini setelah melakukan pembelian."
                class="rounded-lg border border-dashed border-neutral-300 p-6"
              >
                <template #actions>
                  <Button class="w-full">Mulai Belanja</Button>
                </template>
              </EmptyState>
            </div>
          </CardContent>
        </Card>

        <!-- Divider Card -->
        <Card class="md:col-span-2">
          <CardHeader>
            <CardTitle>Divider</CardTitle>
            <CardDescription>Various divider styles for separating content.</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex flex-col gap-6">
              <!-- Solid Line (default) -->
              <div class="space-y-2">
                <p class="text-sm text-neutral-500">Solid Line (default)</p>
                <Divider />
              </div>

              <!-- Dashed Line -->
              <div class="space-y-2">
                <p class="text-sm text-neutral-500">Dashed Line</p>
                <Divider variant="dashed" />
              </div>

              <!-- Thick Solid -->
              <div class="space-y-2">
                <p class="text-sm text-neutral-500">Thick Solid</p>
                <Divider thick />
              </div>

              <!-- With Connector -->
              <div class="space-y-2">
                <p class="text-sm text-neutral-500">With Connector</p>
                <Divider connector />
              </div>

              <!-- Vertical Dividers -->
              <div class="space-y-2">
                <p class="text-sm text-neutral-500">Vertical Dividers</p>
                <div class="flex h-10 items-center gap-4">
                  <span class="text-sm">Item 1</span>
                  <Divider orientation="vertical" />
                  <span class="text-sm">Item 2</span>
                  <Divider orientation="vertical" variant="dashed" />
                  <span class="text-sm">Item 3</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
