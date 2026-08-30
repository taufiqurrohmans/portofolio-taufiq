# AI Portfolio CMS

Website portofolio interaktif untuk mahasiswa Teknik Informatika dengan fokus Komputasi Cerdas dan Artificial Intelligence. Proyek ini memuat website publik, halaman studi kasus, admin CMS, autentikasi, database, penyimpanan media, formulir kontak, SEO dinamis, animasi, serta layout responsif.

## Fitur

### Website publik

- Hero editorial dengan ikon teknologi bergerak.
- Foto profil dan ID card interaktif.
- Navigasi desktop dan menu mobile.
- Filter proyek dan modal ringkasan.
- Halaman studi kasus untuk setiap proyek.
- Bagian profil, statistik, teknologi, pengalaman, sertifikat, proyek, kontak, dan sosial.
- Form kontak dengan validasi, honeypot, dan rate limit.
- Dukungan `prefers-reduced-motion`.
- Metadata SEO yang dapat diubah dari admin.

### Admin CMS

- Login melalui Single Sign-On / Email Allowlist.
- Allowlist admin melalui `ADMIN_EMAILS`.
- Sistem menolak akses admin jika allowlist belum diisi.
- CRUD profil, statistik, teknologi, pengalaman, sertifikat, proyek, pesan, dan media.
- Status proyek `draft` dan `published`.
- Proyek draft tidak masuk API publik dan tidak dapat dibuka melalui halaman studi kasus.
- Upload JPG, PNG, WebP, AVIF, serta PDF hingga 8 MB.
- Alt text wajib untuk gambar.
- Media yang masih dipakai tidak dapat dihapus.
- Audit log untuk perubahan penting.

## Teknologi

| Kebutuhan | Teknologi |
|---|---|
| UI dan server | Next.js API dengan Vinext |
| Bahasa | TypeScript |
| Styling | Tailwind CSS dan CSS khusus |
| Komponen admin | Shadcn UI primitives |
| Ikon | Lucide React |
| Database | Cloudflare D1 dan Drizzle ORM |
| Penyimpanan file | Cloudflare R2 |
| Autentikasi | SSO / Email Allowlist (`ADMIN_EMAILS`) |
| Hosting utama | Cloudflare Workers / Edge Platform |

## Struktur proyek

```text
app/
  admin/                 halaman CMS terlindungi
  api/admin/             endpoint admin
  api/contact/           endpoint formulir kontak
  api/public/            endpoint data publik
  media/                 pembacaan file dari R2
  projects/              halaman studi kasus dinamis
components/              UI publik, admin, dan primitives
db/                      skema database D1
docs/                    panduan operasional
drizzle/                 migrasi database
lib/                     otorisasi, validasi, dan akses data
public/                  favicon dan panduan aset statis
tests/                   smoke tests
.env.example             contoh konfigurasi aman
.openai/hosting.json     binding Sites, D1, dan R2
```

Tidak ada route QA, debug page, dummy test component, atau kredensial nyata di source final.

## Persyaratan lokal

- Node.js 22.13 atau lebih baru.
- npm yang mengikuti versi Node.js tersebut.
- Pengembangan UI dapat dilakukan pada sistem operasi apa pun dengan Node.js dan Vite.

## Setup lokal

1. Ekstrak file proyek.
2. Buka terminal pada folder proyek.
3. Salin konfigurasi contoh.
4. Isi email admin lokal.
5. Instal dependency.
6. Jalankan development server.

```bash
cp .env.example .env.local
npm ci
npm run dev
```

Buka URL yang ditampilkan oleh terminal (`http://localhost:5173`). Website publik memakai initial content sampai database memiliki data baru.

## Environment variables

Gunakan `.env.example` sebagai referensi. Jangan commit `.env.local` atau file `.env` lain.

| Variabel | Wajib | Contoh | Fungsi |
|---|---:|---|---|
| `ADMIN_EMAILS` | Ya | `namaanda@example.com` | Daftar email yang boleh membuka CMS. Pisahkan beberapa email dengan koma. |
| `PUBLIC_SITE_URL` | Disarankan | `https://namaanda.example.com` | Membuat URL absolut untuk Open Graph image yang memakai path `/media/...`. |

`ADMIN_EMAILS` menggunakan sistem fail closed. Jika kosong atau belum tersedia, halaman dan endpoint admin menolak akses.

Jangan menaruh password, token, service key, private key, atau credential database di source. D1 dan R2 memakai binding platform, bukan credential di browser.

## Database setup

Binding dideklarasikan pada konfigurasi platform:

```json
{
  "d1": "DB",
  "project_id": "appgprj_6a92cb80a1048191a25692e0d5c9dee0",
  "r2": "BUCKET"
}
```

Folder `drizzle/` memuat migrasi untuk tabel berikut:

- `site_content`
- `projects`
- `contact_messages`
- `contact_rate_limits`
- `media_assets`
- `audit_logs`

Platform Edge Hosting membuat resource D1 dan R2 serta menjalankan migrasi saat deployment capability pertama dipublikasikan. Jangan mengubah migrasi yang sudah pernah diterapkan. Jika skema berubah, edit `db/schema.ts`, lalu buat migrasi baru:

```bash
npm run db:generate
```

Periksa SQL baru sebelum deployment. Jangan memasukkan seed data besar ke file migrasi.

## Admin setup

1. Atur `ADMIN_EMAILS` pada environment platform.
2. Gunakan email yang sama dengan email akun admin yang didaftarkan.
3. Deploy versi baru agar environment revision aktif.
4. Buka `/admin`.
5. Masuk melalui autentikasi admin.
6. Ganti sample profile dan sample project.
7. Unggah foto, CV, screenshot, dan sertifikat.
8. Simpan URL media pada field yang sesuai.
9. Publikasikan hanya proyek yang sudah lengkap.
10. Uji halaman utama dan studi kasus setelah menyimpan perubahan.

Logout tersedia pada bagian bawah sidebar admin. Akun yang tidak ada di allowlist menerima halaman 403. Endpoint admin juga menolak request tanpa identitas yang sah.

## Alur pengelolaan konten

### Profil dan beranda

Isi nama, headline, subheadline, bio, email, lokasi, universitas, program, status ketersediaan, foto, dan CV. Perubahan tampil pada halaman utama setelah disimpan.

### Proyek

Setiap proyek memuat judul, slug, kategori, tahun, ringkasan, peran, stack, metrik, masalah, solusi, dataset, metode, evaluasi, cover, galeri, live demo, GitHub, warna kartu, status featured, dan status publikasi.

Gunakan `draft` selama data belum lengkap. Pilih `published` agar proyek tampil di halaman utama dan memiliki halaman studi kasus publik.

### Media

Unggah aset terlebih dahulu. Salin URL hasil upload. Tempel URL tersebut pada profil, sertifikat, cover proyek, atau galeri. Hapus media hanya setelah semua referensinya dilepas.

### Pesan

Pesan dari formulir kontak masuk ke menu Pesan. Admin dapat menandai pesan sebagai dibaca, mengarsipkan, membalas melalui email, atau menghapusnya.

## Panduan aset ringkas

| Aset | Ukuran rekomendasi | Format | Batas praktis |
|---|---|---|---|
| Foto hero | 1600 × 2000 px | WebP | 1,5 MB |
| Foto ID card | 1000 × 1000 px | WebP | 700 KB |
| Screenshot desktop | 1600 × 1000 px | WebP | 900 KB |
| Screenshot mobile | 750 × 1624 px | WebP | 600 KB |
| Confusion matrix | 1200 × 900 px | WebP atau PNG | Pastikan label terbaca |
| CV | A4 | PDF | 3 MB |

Endpoint upload membatasi setiap file hingga 8 MB. Gunakan nama file yang singkat, huruf kecil, dan deskriptif. Contoh: `plant-disease-desktop.webp`.

Ikon Brain, CPU, Network, Code, Database, dan Braces sudah memakai Lucide. Anda tidak perlu mengunggahnya. Untuk logo teknologi resmi, gunakan SVG dari pemilik merek dan patuhi aturan penggunaannya.

Panduan lengkap tersedia di `docs/PANDUAN-ASET-DAN-IKON.md`.

## Validasi

Jalankan pemeriksaan berikut sebelum deployment:

```bash
npm run lint
npm run typecheck
npm test
```

`npm test` menjalankan production build dan smoke tests. Hasil yang diharapkan:

- ESLint selesai tanpa error.
- TypeScript selesai tanpa type error.
- Production build membuat route publik, admin, API, media, dan studi kasus.
- Seluruh smoke test lulus.
- Artifact build memuat binding `DB` dan `BUCKET`.

## Deployment ke Edge Platform / Cloudflare

1. Pastikan source, lockfile, migrasi, dan konfigurasi hosting lengkap.
2. Atur `ADMIN_EMAILS` pada environment.
3. Atur `PUBLIC_SITE_URL` jika ingin memakai path internal sebagai Open Graph image.
4. Simpan checkpoint atau commit baru.
5. Deploy secara private.
6. Tunggu deployment berstatus berhasil.
7. Uji `/`, satu `/projects/[slug]`, `/admin`, form kontak, upload media, dan CRUD proyek.
8. Ganti seluruh sample content.
9. Periksa pada desktop, tablet, dan mobile.
10. Ubah akses menjadi publik hanya setelah semua konten dan keamanan siap.

Setiap perubahan environment memerlukan deployment baru agar revisinya aktif.

## Deployment ke platform lain

Frontend dapat dipakai ulang. Backend memakai `cloudflare:workers`, D1, R2, dan header identitas autentikasi admin. Anda dapat menyesuaikan lapisan autentikasi, database, object storage, dan environment binding jika memindahkan proyek ke Vercel, Firebase, Supabase, atau platform lain.

## Dokumentasi tambahan

- `docs/PANDUAN-ADMIN.md`
- `docs/PANDUAN-ASET-DAN-IKON.md`
- `docs/PANDUAN-DEPLOY.md`
- `docs/CHECKLIST-KONTEN-AI.md`
- `docs/ARSITEKTUR-DAN-KEAMANAN.md`
- `docs/LAPORAN-VALIDASI.md`

## Troubleshooting singkat

- Admin 403: periksa `ADMIN_EMAILS`, email akun, lalu deploy ulang setelah perubahan environment.
- Data admin gagal dimuat: pastikan migrasi D1 sudah diterapkan dan binding `DB` aktif.
- Upload gagal: pastikan binding `BUCKET` aktif, tipe file didukung, ukuran maksimal 8 MB, dan alt text gambar sudah diisi.
- Media tidak dapat dihapus: hapus URL media dari profil, sertifikat, cover, atau galeri lebih dahulu.
- Proyek tidak tampil: pastikan statusnya `published` dan simpan tanpa error validasi.
- Open Graph image tidak tampil: gunakan URL HTTPS absolut atau isi `PUBLIC_SITE_URL` untuk path `/media/...`.
