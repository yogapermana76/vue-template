<script setup lang="ts">
  import { Header } from '@/components/layout'

  definePage({
    meta: {
      title: 'Syarat dan Ketentuan',
    },
  })

  const termsContent = `
<p class="body-l text-slate-950 mb-4">Syarat dan Ketentuan</p>

<p class="body-m text-slate-800 mb-4"><strong>1. Definisi</strong><br/>
Program Eco Journey Points adalah bagian dari gerakan "Green Future Powered Today" yang diinisasi dari PT PLN (Persero) untuk mendorong penggunaan energi bersih (listrik) dalam kehidupan sehari-hari. Melalui program ini, masyarakat berpartisipasi dan mengumpulkan poin dengan memindai QR Code di transportasi umum listrik tertentu dan menukarkannya dengan hadiah yang tersedia di aplikasi PLN Mobile.</p>

<p class="body-m text-slate-800 mb-4"><strong>2. Peserta Program</strong></p>
<ul class="list-disc pl-5 mb-4 body-m text-slate-800">
  <li>Program ini terbuka untuk masyarakat umum</li>
  <li>Telah mendownload dan memiliki akun aktif di aplikasi PLN Mobile.</li>
</ul>

<p class="body-m text-slate-800 mb-4"><strong>3. Mekanisme Program</strong></p>
<ul class="list-disc pl-5 mb-4 body-m text-slate-800">
  <li>Peserta menggunakan transportasi umum listrik dengan branding *"Green Future Powered Today"*.</li>
  <li>QR Code tersedia di area interior transportasi umum listrik yang berpartisipasi.</li>
  <li>Peserta memindai QR Code menggunakan aplikasi PLN Mobile.</li>
  <li>Setiap pemindaian QR Code akan memberikan poin yang secara otomatis ditambahkan ke akun PLN Mobile peserta.</li>
  <li>Poin dapat ditukarkan dengan hadiah melalui aplikasi PLN Mobile sesuai nilai tukar yang berlaku.</li>
</ul>

<p class="body-m text-slate-800 mb-4"><strong>4. Batasan dan Ketentuan Pemindaian QR Code</strong></p>
<ul class="list-disc pl-5 mb-4 body-m text-slate-800">
  <li>Setiap peserta hanya dapat memindai QR Code maksimal 2 kali per hari.</li>
  <li>Pemindaian QR Code hanya berlaku di transportasi umum listrik yang berpartisipasi dalam program.</li>
  <li>Pihak PT PLN (Persero) berhak menggugurkan poin yang diterima apabila ditemukan fraud.</li>
</ul>

<p class="body-m text-slate-800 mb-4"><strong>5. Masa Berlaku dan Penukaran Poin</strong></p>
<ul class="list-disc pl-5 mb-4 body-m text-slate-800">
  <li>Poin yang dikumpulkan memiliki masa berlaku 90 hari sejak tanggal perolehan.</li>
  <li>Poin yang tidak ditukarkan hingga masa berlaku habis akan hangus secara otomatis.</li>
  <li>Penukaran poin hanya dapat dilakukan melalui aplikasi PLN Mobile pada menu penukaran yang tersedia.</li>
</ul>

<p class="body-m text-slate-800 mb-4"><strong>6. Syarat Teknis dan Akun PLN Mobile</strong></p>
<ul class="list-disc pl-5 mb-4 body-m text-slate-800">
  <li>Peserta wajib memiliki akun PLN Mobile yang terdaftar dan terverifikasi.</li>
  <li>Akun peserta harus aktif dan bebas dari indikasi penyalahgunaan atau aktivitas mencurigakan.</li>
</ul>

<p class="body-m text-slate-800 mb-4"><strong>7. Ketentuan Penukaran Voucher Listrik</strong></p>
<ul class="list-disc pl-5 mb-4 body-m text-slate-800">
  <li>Voucher listrik hanya dapat digunakan untuk pembayaran tagihan listrik yang terdaftar di PLN Mobile.</li>
  <li>Voucher tidak dapat diuangkan atau dipindahtangankan.</li>
  <li>Syarat dan ketentuan tambahan terkait voucher listrik dapat dilihat di aplikasi PLN Mobile.</li>
</ul>

<p class="body-m text-slate-800 mb-4"><strong>8. Larangan dan Penyalahgunaan</strong></p>
<ul class="list-disc pl-5 mb-4 body-m text-slate-800">
  <li>Penyalahgunaan QR Code, seperti pemindaian melebihi batas harian, pemalsuan akun, atau manipulasi sistem, akan menyebabkan diskualifikasi dari program dan banned account.</li>
  <li>PLN berhak menghentikan keikutsertaan peserta yang melanggar syarat dan ketentuan ini tanpa pemberitahuan terlebih dahulu.</li>
</ul>

<p class="body-m text-slate-800 mb-4"><strong>9. Perubahan Syarat dan Ketentuan</strong></p>
<ul class="list-disc pl-5 mb-4 body-m text-slate-800">
  <li>PT PLN (Persero) berhak mengubah atau memperbarui syarat dan ketentuan program tanpa pemberitahuan sebelumnya.</li>
  <li>Informasi perubahan akan diumumkan melalui aplikasi PLN Mobile atau kanal komunikasi resmi lainnya.</li>
</ul>

<p class="body-m text-slate-800 mb-4"><strong>10. Layanan Pelanggan</strong></p>
<ul class="list-disc pl-5 mb-4 body-m text-slate-800">
  <li>Jika terdapat kendala selama program berlangsung, peserta dapat menghubungi layanan pelanggan PLN melalui aplikasi PLN Mobile atau +62 ....................</li>
  <li>Layanan pelanggan akan membantu menyelesaikan masalah terkait pemindaian QR Code, pengumpulan poin, atau penukaran voucher.</li>
</ul>
`
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white">
    <!-- Header -->
    <Header title="Syarat dan Ketentuan" positioning="sticky" />

    <!-- Content -->
    <main class="flex flex-1 flex-col gap-4 px-4 py-4">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="termsContent" />
    </main>
  </div>
</template>
