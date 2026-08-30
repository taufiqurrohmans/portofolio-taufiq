# Panduan Foto, Screenshot, dan Ikon

Panduan ini menjaga visual website tetap profesional, ringan, konsisten, dan mudah dibaca di HP maupun laptop.

## Daftar aset yang perlu disiapkan

| Aset | Ukuran kerja | Rasio | Format final | Target ukuran file |
|---|---:|---:|---|---:|
| Foto hero | 1600 × 2000 px | 4:5 | WebP | di bawah 1,5 MB |
| Foto ID card | 1000 × 1000 px | 1:1 | WebP | di bawah 700 KB |
| Cover proyek desktop | 1600 × 1000 px | 8:5 | WebP | di bawah 900 KB |
| Screenshot mobile | 750 × 1624 px | layar HP | WebP | di bawah 600 KB |
| Screenshot galeri | 1600 × 1000 px | 8:5 | WebP | di bawah 900 KB |
| Grafik atau confusion matrix | 1200 × 900 px | 4:3 | PNG/WebP | di bawah 700 KB |
| Sertifikat | 1400 × 1000 px | menyesuaikan | WebP | di bawah 800 KB |
| Open Graph | 1200 × 630 px | 1.91:1 | WebP/JPG | di bawah 500 KB |
| CV | A4, 1 sampai 2 halaman | A4 | PDF | di bawah 3 MB |

Sistem menerima file sampai 8 MB, tetapi target di atas lebih baik untuk kecepatan website.

## Cara menyiapkan foto hero

1. Gunakan kamera HP utama, bukan kamera depan jika kualitasnya jauh lebih rendah.
2. Berdiri 1 sampai 1,5 meter dari kamera.
3. Gunakan cahaya lembut dari jendela pada sudut sekitar 45 derajat.
4. Pilih latar polos berwarna putih, abu muda, atau biru sangat muda.
5. Ambil foto setengah badan. Sisakan ruang di atas kepala dan sisi bahu.
6. Gunakan pakaian polos yang kontras dengan latar.
7. Tatap kamera atau sedikit menyamping. Ekspresi ramah dan natural.
8. Hindari mode portrait yang memotong rambut, telinga, atau bahu secara kasar.
9. Lakukan crop 4:5 pada 1600 × 2000 px.
10. Koreksi exposure dan white balance secukupnya. Jangan menghaluskan wajah berlebihan.
11. Ekspor sebagai WebP kualitas sekitar 80 sampai 86.

Website memakai `object-fit: cover`. Area tepi foto dapat terpotong pada layar tertentu. Jaga wajah dan bahu tetap berada di 70 persen area tengah.

## Foto ID card

Anda dapat memakai foto hero yang sama, tetapi versi khusus 1:1 akan lebih presisi.

- Wajah menghadap kamera.
- Kepala dan bahu berada di tengah.
- Hindari tangan atau benda yang menutupi dada.
- Gunakan latar bersih.
- Website menampilkan foto ID dalam gaya grayscale, sehingga kontras wajah dan pakaian harus cukup.

## Cara mengambil screenshot per website

Untuk setiap proyek website, siapkan minimal tiga visual:

1. Cover desktop yang menunjukkan halaman paling penting.
2. Tampilan mobile dari halaman atau flow yang sama.
3. Satu detail fitur, dashboard, hasil AI, grafik, atau halaman proses.

Langkah desktop:

1. Buka versi production atau preview yang stabil.
2. Gunakan viewport sekitar 1440 × 900 atau 1600 × 1000.
3. Sembunyikan bookmark bar, tab browser, DevTools, notifikasi, dan data pribadi.
4. Isi UI dengan data contoh yang realistis. Jangan menampilkan lorem ipsum.
5. Pastikan tidak ada loading state, error, cursor yang mengganggu, atau menu terbuka tanpa tujuan.
6. Ambil screenshot dengan skala browser 100 persen.
7. Crop ke 1600 × 1000 px dengan fokus pada fitur utama.
8. Tambahkan margin atau mockup perangkat hanya jika konsisten pada semua proyek.

Langkah mobile:

1. Gunakan viewport 375 × 812, 390 × 844, atau ukuran perangkat nyata.
2. Periksa header, menu, tombol, modal, form, dan overflow horizontal.
3. Ambil screenshot dengan rasio perangkat. Ekspor sekitar 750 × 1624 px untuk ketajaman 2x.
4. Jangan meregangkan screenshot mobile menjadi landscape.

Untuk proyek AI, tambahkan visual berikut bila relevan:

- Contoh input dan output prediksi.
- Confusion matrix dengan label kelas terbaca.
- Kurva training dan validation.
- Perbandingan baseline dan model final.
- Diagram pipeline data yang bersih.
- Tampilan API atau dashboard, bukan screenshot kode yang terlalu kecil.

## Penamaan file

Gunakan huruf kecil, angka, dan tanda hubung.

```text
portrait-hero-your-name.webp
portrait-id-your-name.webp
plant-disease-desktop.webp
plant-disease-mobile.webp
plant-disease-confusion-matrix.webp
sentiment-dashboard.webp
cv-your-name.pdf
certificate-machine-learning.webp
og-portfolio-your-name.webp
```

Hindari nama seperti `IMG_8273.JPG`, `Screenshot final revisi 2.png`, atau nama dengan spasi.

## Alt text

Alt text menjelaskan informasi penting pada gambar kepada pengguna screen reader.

Baik:

```text
Dashboard klasifikasi penyakit daun dengan hasil prediksi dan confidence score
```

Kurang baik:

```text
gambar proyek
screenshot
foto
```

Jangan menulis `gambar dari` atau `foto dari` karena elemen gambar sudah dikenali oleh screen reader. Untuk foto profil, cukup `Foto Nama Anda`.

## Ikon yang sudah tersedia

Website sudah memakai ikon Lucide berikut:

- Brain Circuit untuk AI.
- CPU untuk komputasi.
- Network untuk neural network dan konektivitas.
- Code untuk software development.
- Database untuk data.
- Braces untuk programming.
- Sparkles untuk aksen visual.

Ikon tersebut berupa SVG, tetap tajam pada semua layar, dan tidak perlu diunggah.

## Standar ikon tambahan

Jika menambah logo Python, TensorFlow, PyTorch, atau teknologi lain:

1. Ambil SVG resmi dari pemilik merek.
2. Pastikan izin penggunaan merek sesuai.
3. Gunakan kanvas persegi dengan `viewBox` yang rapi.
4. Hapus ruang kosong berlebihan di sekeliling logo.
5. Simpan dengan nama seperti `python-logo.svg`.
6. Jangan menyalin logo dari screenshot atau hasil pencarian beresolusi rendah.
7. Jangan mengubah proporsi, warna resmi, atau menambahkan efek 3D pada logo merek.
8. Untuk ikon antarmuka, tetap gunakan gaya outline Lucide agar konsisten.

## Gerak dan interaksi

Gerakan sudah dibuat dengan CSS agar ringan:

- Ikon hero mengambang dengan durasi yang berbeda.
- Orb bergerak perlahan sebagai latar.
- Lanyard ID card bergoyang.
- ID card mengikuti pointer dengan rotasi maksimal yang lembut.
- Section muncul saat memasuki viewport.
- Kartu dan tombol memberi feedback hover.

Aturan saat menambah animasi:

- Durasi micro-interaction: 160 sampai 280 ms.
- Durasi floating loop: 3,5 sampai 7 detik.
- Gerakan maksimal sekitar 8 sampai 16 px.
- Hindari lebih dari 6 elemen besar bergerak bersamaan.
- Jangan membuat teks utama terus bergerak.
- Pastikan touch target tombol minimal 44 × 44 px.
- Selalu hormati `prefers-reduced-motion`.

## Pemeriksaan akhir aset

- Foto tidak blur dan tidak terlalu gelap.
- Wajah tidak terpotong pada desktop dan mobile.
- Semua screenshot memakai ukuran dan radius visual yang konsisten.
- Tidak ada password, API key, email pribadi pihak lain, atau data sensitif.
- Grafik memiliki judul, label, dan legenda yang terbaca.
- File gambar memakai WebP/AVIF kecuali transparansi atau grafik membutuhkan PNG.
- Semua gambar bermakna memiliki alt text.
- CV memiliki link aktif dan nama file profesional.
