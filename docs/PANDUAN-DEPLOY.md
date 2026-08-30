# Panduan Deployment

Paket ini dikonfigurasi untuk Edge Platform dengan Cloudflare D1, R2, dan sistem autentikasi allowlist.

## Konfigurasi yang sudah tersedia

Konfigurasi platform mendeklarasikan:

```json
{
  "d1": "DB",
  "project_id": "appgprj_6a92cb80a1048191a25692e0d5c9dee0",
  "r2": "BUCKET"
}
```

- `DB` menyimpan konten, proyek, pesan, rate limit, media metadata, dan audit log.
- `BUCKET` menyimpan file gambar dan PDF.
- Migrasi D1 berada di `drizzle/` dan dijalankan oleh lifecycle deployment Sites.

## Variabel keamanan wajib

Set variabel berikut pada environment Site:

```dotenv
ADMIN_EMAILS=namaanda@email.com
```

Untuk beberapa admin:

```dotenv
ADMIN_EMAILS=admin1@email.com,admin2@email.com
```

Gunakan alamat email yang sama dengan email akun admin yang didaftarkan. Jangan membuka website untuk publik sebelum allowlist ini aktif.

Sistem memakai prinsip fail closed. Jika `ADMIN_EMAILS` kosong, semua akses halaman dan endpoint admin ditolak.

## Variabel URL publik

Setelah memiliki URL final, isi variabel berikut:

```dotenv
PUBLIC_SITE_URL=https://alamat-portofolio-anda.example.com
```

Variabel ini direkomendasikan jika Open Graph image memakai path internal seperti `/media/portfolio/...`. Tanpa nilai ini, gunakan URL HTTPS absolut pada field Open Graph image.

## Validasi lokal

```bash
npm ci
npm run db:generate
npm run lint
npm run typecheck
npm test
```

Hasil yang diharapkan:

- ESLint: 0 error.
- TypeScript: 0 error.
- Production build: berhasil.
- Structural smoke tests: seluruh test lulus.
- Tidak ada migrasi tak terduga setelah `db:generate` dijalankan ulang.

## Deployment ke Platform Hosting

1. Buka proyek platform yang sesuai.
2. Pastikan seluruh source dan folder `drizzle/` ikut tersimpan.
3. Atur `ADMIN_EMAILS` dan `PUBLIC_SITE_URL`.
4. Buat checkpoint atau versi baru.
5. Deploy secara private terlebih dahulu.
6. Tunggu status deployment menjadi `succeeded`.
7. Uji halaman `/`, satu halaman studi kasus, `/admin`, upload media, simpan proyek draft, dan inbox kontak.
8. Ganti sample content.
9. Uji kembali pada lebar mobile dan desktop.
10. Ubah akses menjadi publik hanya jika seluruh pemeriksaan aman.

## Checklist sebelum publik

- `ADMIN_EMAILS` sudah aktif dan diuji dengan akun yang benar.
- `PUBLIC_SITE_URL` memakai URL HTTPS production yang benar.
- Akun lain tidak dapat membuka admin.
- Nama, bio, email, universitas, CV, dan sosial sudah benar.
- Tidak ada sample title atau placeholder yang tersisa.
- Semua proyek published memiliki cover, ringkasan, metode, hasil, dan link yang valid.
- Repository publik tidak mengandung `.env`, secret, token, dataset privat, atau model berlisensi terbatas.
- Form kontak berhasil menyimpan pesan.
- Upload dan hapus media berhasil.
- Alt text terisi.
- Metadata SEO dan Open Graph sudah sesuai.
- Mobile menu, filter, modal, dan ID card dapat digunakan.
- Animasi berkurang ketika reduced motion aktif.

## Setelah deployment

1. Buka URL production pada mode incognito untuk menguji tampilan publik.
2. Buka `/admin` dengan akun admin.
3. Kirim satu pesan uji dari form kontak.
4. Tandai pesan sebagai dibaca lalu hapus jika tidak diperlukan.
5. Periksa satu proyek pada HP nyata.
6. Periksa semua tautan eksternal.

## Rollback

Jika versi baru bermasalah, gunakan checkpoint atau release terakhir yang sudah lolos validasi. Jangan menghapus migrasi yang pernah dijalankan. Buat migrasi koreksi baru jika struktur database perlu diperbaiki.

## Hosting platform lain

Source ini memakai `cloudflare:workers`, D1, R2, dan header identitas autentikasi admin. Jika dipindahkan ke Vercel, Firebase, Supabase, atau host lain, ganti lapisan database, object storage, dan autentikasi terlebih dahulu. Frontend dapat dipakai ulang secara langsung.
