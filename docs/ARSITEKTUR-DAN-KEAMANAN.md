# Arsitektur dan Keamanan

## Alur data

```text
Pengunjung -> Website publik -> D1 untuk konten dan proyek
Pengunjung -> Form kontak -> validasi + rate limit -> D1 inbox
Admin -> Autentikasi SSO -> allowlist email -> Admin CMS
Admin -> Upload media -> R2 -> URL /media/portfolio/...
Admin -> Simpan konten -> validasi Zod -> D1 + audit log
```

## Tabel D1

| Tabel | Fungsi |
|---|---|
| `site_content` | Profil, statistik, skill, pengalaman, sertifikat, sosial, dan SEO |
| `projects` | Proyek, status, studi kasus, link, serta galeri |
| `contact_messages` | Pesan dari form publik |
| `contact_rate_limits` | Counter satu jam dengan fingerprint yang di-hash |
| `media_assets` | Metadata file R2 |
| `audit_logs` | Catatan perubahan admin |

## Kontrol keamanan

- Admin membutuhkan autentikasi akun terdaftar.
- `ADMIN_EMAILS` membatasi akun yang boleh mengelola konten. Jika nilainya kosong, akses admin ditolak seluruhnya.
- Semua endpoint admin memeriksa identitas di server.
- Input publik dan admin divalidasi dengan Zod.
- URL dibatasi ke HTTP(S), `mailto:` untuk sosial, atau path internal yang aman.
- Upload dibatasi menurut MIME type dan ukuran.
- SVG tidak diterima melalui upload untuk mengurangi risiko active content.
- Alt text wajib untuk gambar.
- Form kontak memakai honeypot dan rate limit.
- Fingerprint rate limit di-hash, alamat IP mentah tidak disimpan.
- Operasi tulis utama dicatat pada audit log.
- Status draft mencegah proyek belum siap tampil ke publik.

## Batasan yang perlu diketahui

- Allowlist kosong menolak semua akses admin secara fail closed. Pastikan ADMIN_EMAILS terisi.
- Menghapus media tidak otomatis mencari seluruh referensi URL. Periksa pemakaian file secara manual.
- Sistem tidak mengirim notifikasi email untuk pesan baru. Pesan dibaca melalui admin.
- Audit log tidak menggantikan backup atau versioning deployment.
- Rate limit berbasis fingerprint adalah pengendalian spam ringan, bukan sistem anti-abuse tingkat enterprise.

## Praktik operasional

- Gunakan email admin yang memiliki MFA.
- Jangan menyimpan API key atau secret di bidang CMS.
- Jangan mengunggah dataset privat atau dokumen identitas.
- Pastikan repository proyek yang ditautkan tidak mengandung `.env`.
- Simpan checkpoint sebelum perubahan besar.
- Periksa audit log setelah menambah admin baru.
