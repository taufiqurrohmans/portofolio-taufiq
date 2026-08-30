# Laporan Validasi

Tanggal pemeriksaan: 30 Agustus 2026

## Hasil otomatis

| Pemeriksaan | Hasil |
|---|---|
| `git diff --check` | Lulus, tidak ada whitespace error |
| `npm run db:generate` | Lulus, tidak ada perubahan skema tersisa |
| `npm run lint` | Lulus, 0 error aplikasi |
| `npm run typecheck` | Lulus, 0 type error |
| Production build | Lulus, seluruh route publik, admin, API, media, dan studi kasus terbentuk |
| Node smoke tests | Lulus, 13 dari 13 test |
| Dependency tree | Lulus, tidak ada dependency yang hilang |
| D1 migrations | Lulus, 6 tabel dan seluruh kolom studi kasus tersedia |
| Hosting bindings | Lulus, D1 `DB` dan R2 `BUCKET` masuk artifact build |
| Environment sample | Lulus, hanya berisi placeholder aman |
| Source hygiene | Lulus, tidak ada QA route, debug page, dummy test component, atau starter example |

## QA browser website publik

Desktop diuji pada viewport 1363 × 936 px.

- Hero, typography, CTA, placeholder foto, dan enam ikon bergerak tampil.
- ID card visual tersedia dan menerima efek pointer.
- Nilai posisi ikon berubah selama runtime sehingga animasi terbukti aktif.
- Navigasi `Explore projects` berpindah ke bagian proyek.
- Filter `Computer Vision` menyisakan proyek dengan kategori yang benar.
- Modal proyek terbuka dan menyediakan tautan studi kasus lengkap.
- Halaman `/projects/sample-image-classification` terbuka dengan lima bagian detail.
- Tidak ada overflow horizontal pada halaman utama dan studi kasus.
- Judul dan metadata halaman membaca konfigurasi CMS.

Mobile sebelumnya diuji pada viewport sekitar 390 × 844 px. Source visual dan CSS responsif tidak diubah setelah pass tersebut.

- Navigasi desktop berubah menjadi tombol mobile.
- Label tombol berubah menjadi `Tutup menu` saat menu terbuka.
- Target link menu dan filter memiliki tinggi minimal 44 px.
- Grid proyek berubah menjadi satu kolom.
- Hero, CTA, visual profil, dan ikon tidak menimbulkan overflow horizontal.

Tablet divalidasi melalui breakpoint 900 px, susunan grid, dan aturan overflow. Layout berubah menjadi satu kolom pada section utama, sementara toolkit dan sertifikat memakai dua kolom. Pemeriksaan browser dalam lingkungan ini tidak menyediakan pengubahan viewport langsung, sehingga tablet fisik tetap masuk checklist pemilik sebelum akses publik.

## QA admin CMS

- Halaman `/admin` memakai sistem autentikasi allowlist email.
- Semua endpoint admin memeriksa identitas dan allowlist server-side.
- Allowlist memakai prinsip fail closed. `ADMIN_EMAILS` kosong berarti semua akses admin ditolak.
- Akun di luar allowlist menerima 403 pada halaman admin atau 401 pada endpoint.
- Dashboard memiliki loading skeleton, retry error state, metric cards, dan aktivitas terbaru.
- Proyek, teknologi, pengalaman, sertifikat, pesan, media, profil, statistik, sosial, dan SEO memiliki editor atau CRUD yang sesuai.
- Form profile dan proyek divalidasi dengan Zod.
- Draft tidak keluar melalui API publik dan tidak dapat dibuka sebagai studi kasus.
- Penghapusan proyek terakhir mempertahankan empty state. Sample project tidak muncul kembali setelah CMS mulai dipakai.
- Upload media membatasi tipe, ukuran, dan alt text.
- Media yang masih direferensikan oleh profil, sertifikat, cover, atau galeri tidak dapat dihapus.
- Logout memakai route dispatch autentikasi admin.

Visual admin sebelumnya diuji melalui harness sementara. Harness tersebut sudah dihapus sebelum build final. Tidak ada route atau komponen QA pada source production.

Uji tulis authenticated pada deployment memerlukan nilai `ADMIN_EMAILS` milik pemilik. Nilai tersebut tidak dibuat atau ditebak oleh paket ini. Setelah diisi, lakukan satu smoke test profile, proyek, media, pesan, dan logout menggunakan akun tersebut.

## Validasi keamanan dan data

- Data profile, project, URL, dan form kontak divalidasi server-side.
- URL eksternal hanya menerima HTTPS. Tautan email hanya menerima `mailto:`.
- Path media internal harus diawali `/`, tidak boleh memakai path traversal, backslash, atau protocol-relative URL.
- Form kontak memiliki honeypot dan batas lima pesan per fingerprint per jam.
- Fingerprint rate limit menggunakan SHA-256 dan tidak menyimpan IP mentah.
- File media memakai extension yang ditentukan dari MIME type, bukan nama file dari pengguna.
- Media disajikan dengan `X-Content-Type-Options: nosniff`.
- Operasi admin penting masuk audit log.
- Draf proyek tidak bocor melalui endpoint publik atau metadata studi kasus.
- Source final tidak memuat `.env`, token, password, service key, private key, atau credential nyata.

## Konfigurasi pemilik

- Isi `ADMIN_EMAILS` dengan email akun admin yang didaftarkan.
- `PUBLIC_SITE_URL` sudah dapat memakai URL production. Perbarui jika nanti memakai custom domain.
- Ganti nama, email, universitas, profil, sosial, dan sample project.
- Unggah foto, screenshot, CV, sertifikat, dan Open Graph image asli.
- Ganti metrik dan hasil model dengan hasil eksperimen yang benar.
- Uji tablet dan HP fisik sebelum membuat Site publik.

Item tersebut memerlukan identitas, aset, atau keputusan pemilik. Kerangka aplikasi tidak dapat mengisinya secara aman tanpa data tersebut.
