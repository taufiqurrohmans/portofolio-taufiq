# Panduan Admin CMS

Halaman admin tersedia di `/admin`. Gunakan akun dengan email yang tercantum pada konfigurasi `ADMIN_EMAILS`.

## Urutan pengisian yang disarankan

1. Buka menu **Media** dan unggah seluruh aset utama.
2. Salin URL setiap media.
3. Isi **Beranda & Profil**.
4. Isi **Teknologi**, **Pengalaman**, dan **Sertifikat**.
5. Tambahkan proyek melalui menu **Proyek**.
6. Isi **Statistik & Sosial**, termasuk SEO.
7. Periksa website melalui tombol **Lihat website**.

## Dashboard

Dashboard menampilkan jumlah proyek, proyek terbit, pesan baru, media, dan aktivitas admin terbaru. Angka diperbarui setelah perubahan berhasil disimpan.

## Media

Format yang diterima:

- JPG atau PNG untuk sumber awal.
- WebP atau AVIF untuk gambar final yang lebih ringan.
- PDF untuk CV.
- Maksimal 8 MB per file.

Langkah unggah:

1. Pilih file.
2. Isi alt text untuk gambar. Contoh: `Tampilan dashboard prediksi penyakit tanaman pada laptop`.
3. Klik **Upload**.
4. Klik **Salin URL** pada kartu media.
5. Tempel URL `/media/portfolio/...` pada bidang foto, cover, galeri, sertifikat, atau CV.

Menghapus media juga menghapus file dari storage. Sebelum menghapus, pastikan URL tersebut tidak dipakai pada profil, proyek, sertifikat, atau SEO.

## Beranda & Profil

Isi data berikut:

- Nama lengkap dan inisial.
- Headline, misalnya `AI & SOFTWARE DEVELOPER`.
- Subheadline, misalnya `Informatics Student · Intelligent Computing`.
- Email, lokasi, universitas, program, dan status ketersediaan.
- Bio 2 sampai 4 kalimat.
- URL foto profil dan URL CV.

Gunakan tombol **Simpan** di kanan atas. Foto yang sama dipakai untuk hero dan ID card agar identitas visual konsisten.

## Teknologi

Tambahkan teknologi yang benar-benar pernah dipakai. Kelompokkan secara jujur:

- Programming: Python, TypeScript, Java.
- AI Framework: TensorFlow, PyTorch.
- Machine Learning: Scikit-learn, XGBoost.
- Data: Pandas, NumPy, SQL.
- Computer Vision: OpenCV, YOLO.
- Web: React, Next.js, FastAPI.

Gunakan level deskriptif seperti `Frequently Used`, `Comfortable`, atau `Currently Learning`. Hindari persentase kemampuan karena sulit dibuktikan.

## Pengalaman

Pengalaman dapat mencakup pendidikan, magang, organisasi, lomba, riset, asisten praktikum, dan proyek tim. Jelaskan kontribusi serta hasil, bukan hanya nama posisi.

Contoh deskripsi:

> Mengembangkan pipeline klasifikasi citra bersama tim 3 orang, menyiapkan preprocessing, eksperimen model, dan dokumentasi evaluasi.

## Sertifikat

Isi nama sertifikat, penerbit, tahun, credential URL, dan URL gambar opsional. Prioritaskan sertifikat yang relevan dengan AI, data, software engineering, cloud, atau bahasa Inggris profesional.

## Proyek dan studi kasus

Klik **Tambah proyek**, lalu isi:

| Bidang | Isi yang baik |
|---|---|
| Judul | Nama proyek singkat dan spesifik |
| Slug | Huruf kecil dan tanda hubung, contoh `plant-disease-classifier` |
| Kategori | AI / ML, Computer Vision, NLP, atau Web Development |
| Peran | Kontribusi pribadi Anda |
| Ringkasan | Masalah, cara kerja, dan manfaat dalam 2 sampai 4 kalimat |
| Masalah | Konteks pengguna dan alasan proyek dibutuhkan |
| Solusi | Sistem yang dibuat dan cara pengguna memakainya |
| Dataset | Sumber, ukuran, kelas, izin, dan pembagian train/validation/test |
| Metode | Preprocessing, model, parameter penting, backend, dan frontend |
| Evaluasi | Metrik, baseline, hasil, error analysis, dan keterbatasan |
| Teknologi | Pisahkan dengan koma |
| Screenshot utama | URL cover desktop atau visual terbaik |
| Galeri | Satu URL per baris |
| Demo dan GitHub | URL HTTPS jika boleh dibuka publik |
| Featured | Aktifkan untuk proyek unggulan |
| Published | Aktifkan hanya setelah semua isi siap |

Setelah disimpan, studi kasus tersedia di `/projects/slug-proyek`.

## Pesan

- `unread`: belum diperiksa.
- `read`: sudah dibaca.
- `archived`: sudah selesai atau tidak lagi aktif.
- **Balas** membuka aplikasi email.
- **Hapus** menghapus pesan secara permanen setelah konfirmasi.

Form publik membatasi 5 pengiriman per fingerprint per jam dan tidak menyimpan alamat IP mentah.

## Statistik, sosial, dan SEO

Statistik harus dapat dipertanggungjawabkan. Contoh: `06+ Projects completed`, `04 AI focus areas`.

Untuk tautan sosial, gunakan URL lengkap `https://...`. Email memakai `mailto:nama@email.com`.

SEO:

- Meta title: 10 sampai 70 karakter.
- Meta description: 50 sampai 180 karakter.
- Keywords: pisahkan dengan koma.
- Open Graph image: disarankan URL HTTPS absolut berukuran 1200 × 630 px.

## Bila perubahan gagal disimpan

1. Periksa bidang kosong atau URL yang salah.
2. URL media internal harus diawali `/`, misalnya `/media/portfolio/...`.
3. URL eksternal harus memakai `https://` atau `http://`.
4. Slug proyek hanya boleh berisi huruf kecil, angka, dan tanda hubung.
5. Ringkasan proyek minimal 20 karakter.
6. Muat ulang halaman admin jika sesi login sudah lama.
