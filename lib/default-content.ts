export type PortfolioProject = {
  id: string;
  title: string;
  slug: string;
  category: "AI / ML" | "Computer Vision" | "NLP" | "Web Development" | "Data Analysis" | "Software Engineering";
  year: string;
  summary: string;
  role: string;
  stack: string[];
  metric?: string;
  problem?: string;
  solution?: string;
  dataset?: string;
  method?: string;
  evaluation?: string;
  galleryUrls?: string[];
  accent: string;
  featured: boolean;
  status: "draft" | "published";
  coverUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  flag?: string;
};

export type PortfolioContent = {
  profile: {
    name: string;
    initials: string;
    headline: string;
    subheadline: string;
    bio: string;
    email: string;
    location: string;
    university: string;
    program: string;
    availability: string;
    photoUrl?: string;
    cvUrl?: string;
  };
  stats: Array<{ value: string; label: string }>;
  skills: Array<{ name: string; group: string; level: string }>;
  experience: Array<{
    period: string;
    title: string;
    organization: string;
    description: string;
  }>;
  certificates: Array<{
    id: string;
    title: string;
    issuer: string;
    year: string;
    credentialUrl?: string;
    imageUrl?: string;
  }>;
  gallery?: GalleryItem[];
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImageUrl?: string;
  };
  projects: PortfolioProject[];
  socialLinks: Array<{ label: string; href: string }>;
};

export const defaultPortfolio: PortfolioContent = {
  profile: {
    name: "TAUFIQUR ROHMAN S",
    initials: "TR",
    headline: "Data Analyst & Web Developer",
    subheadline: "Mahasiswa Teknik Informatika",
    bio: "Mahasiswa Teknik Informatika semester 7 di Universitas Yudharta Pasuruan (<mark>IPK 3.86</mark>) dengan minat pada <mark>analisis data dan pengembangan web</mark>. Berpengalaman mengelola dan menstrukturkan data melalui proyek aplikasi berbasis database (<mark>MySQL, Firebase</mark>) serta pengalaman langsung sebagai <mark>Agen Statistik</mark> di Pojok Statistik kampus. Memiliki dasar pemrograman <mark>Python</mark> untuk pengolahan dan analisis data (termasuk analisis sentimen media sosial), didukung kemampuan <mark>problem solving, kerja tim, dan pengalaman organisasi</mark> sebagai koordinator.",
    email: "taufiqur.id@gmail.com",
    location: "Kabupaten Pasuruan, Jawa Timur",
    university: "Universitas Yudharta Pasuruan",
    program: "S1 Teknik Informatika",
    availability: "Open for collaboration & opportunities",
  },
  stats: [
    { value: "3.86", label: "GPA / IPK" },
    { value: "04+", label: "Projects Completed" },
    { value: "03+", label: "Organizations" },
    { value: "05+", label: "Certifications & Awards" },
  ],
  skills: [
    { name: "Python", group: "Data & Analisis", level: "Comfortable" },
    { name: "SQL", group: "Data & Analisis", level: "Comfortable" },
    { name: "Microsoft Excel", group: "Data & Analisis", level: "Comfortable" },
    { name: "JavaScript", group: "Bahasa Pemrograman", level: "Comfortable" },
    { name: "Java", group: "Bahasa Pemrograman", level: "Familiar" },
    { name: "Laravel", group: "Pengembangan Web", level: "Comfortable" },
    { name: "React.js", group: "Pengembangan Web", level: "Comfortable" },
    { name: "MySQL", group: "Basis Data", level: "Comfortable" },
    { name: "Firebase", group: "Basis Data", level: "Comfortable" },
    { name: "Git / GitHub", group: "Version Control", level: "Comfortable" },
  ],
  experience: [
    {
      period: "2023 - Sekarang",
      title: "S1 Teknik Informatika",
      organization: "Universitas Yudharta Pasuruan",
      description: "Menempuh pendidikan S1 Teknik Informatika. Saat ini berada di semester 7 dengan IPK 3.86 / 4.00.",
    },
    {
      period: "2025 - Sekarang",
      title: "Agen Statistik",
      organization: "Pojok Statistik, Univ. Yudharta Pasuruan",
      description: "Membantu proses pengumpulan, input, dan validasi data statistik di lingkungan kampus. Mendukung pengolahan dan penyajian data dalam bentuk laporan/rangkuman statistik deskriptif.",
    },
    {
      period: "2025 - Sekarang",
      title: "Anggota Media dan Pers",
      organization: "PAC IPNU-IPPNU Wonorejo",
      description: "Mengelola konten dan publikasi media untuk mendukung informasi dan komunikasi organisasi.",
    },
    {
      period: "2023 - 2025",
      title: "Koordinator Kominfo",
      organization: "Himpunan Mahasiswa Teknik Informatika (HMTI)",
      description: "Mengoordinasikan program kerja dan tim untuk mendukung kegiatan akademik serta non-akademik mahasiswa Teknik Informatika.",
    },
  ],
  projects: [
    {
      id: "kuliah-kuy",
      title: "Kuliah Kuy — Manajemen Perkuliahan",
      slug: "kuliah-kuy",
      category: "Web Development",
      year: "2024",
      summary: "Merancang dan mengembangkan sistem manajemen perkuliahan berbasis web untuk pencatatan jadwal, kehadiran, dan data akademik mahasiswa.",
      role: "Full-Stack Developer (Proyek Tim)",
      stack: ["Laravel", "MySQL"],
      metric: "Memperoleh sertifikat HKI",
      problem: "Kebutuhan pencatatan jadwal, kehadiran, dan data akademik yang lebih terstruktur.",
      solution: "Mengembangkan aplikasi web dengan struktur basis data relasional (MySQL) untuk manajemen perkuliahan terpadu.",
      accent: "blue",
      featured: true,
      status: "published",
    },
    {
      id: "sim-kkn",
      title: "SIM KKN — Sistem Informasi Manajemen KKN",
      slug: "sim-kkn",
      category: "Web Development",
      year: "2024",
      summary: "Membangun sistem informasi manajemen KKN dengan modul manajemen keuangan dan presensi peserta secara real-time.",
      role: "Developer (Proyek Individu)",
      stack: ["React.js", "Firebase"],
      problem: "Pengelolaan keuangan dan presensi peserta KKN yang belum tersistematis dengan baik secara real-time.",
      solution: "Membangun aplikasi React.js yang mengintegrasikan Firebase sebagai basis data NoSQL untuk pencatatan pelaporan secara real-time.",
      accent: "violet",
      featured: true,
      status: "published",
    },
    {
      id: "website-humanika",
      title: "Website Humanika",
      slug: "website-humanika",
      category: "Web Development",
      year: "2024",
      summary: "Merancang dan mengelola website Himpunan Mahasiswa Teknik Informatika (Humanika) sebagai media informasi.",
      role: "Web Designer / Developer (Proyek Tim)",
      stack: ["Google Sites"],
      problem: "Kebutuhan media informasi, komunikasi, dan dokumentasi kegiatan organisasi yang mudah diakses.",
      solution: "Menyusun struktur konten dan arsip menggunakan platform berbasis cloud agar mudah diakses oleh anggota dan pihak eksternal.",
      accent: "lime",
      featured: true,
      status: "published",
    },
    {
      id: "web-petani-krisan",
      title: "Web Pendataan Lokasi Petani Krisan",
      slug: "web-petani-krisan",
      category: "Web Development",
      year: "2025",
      summary: "Mengembangkan aplikasi web menggunakan Google Apps Script untuk pendataan dan pemetaan lokasi petani krisan.",
      role: "Developer (Proyek Tim - PPK Ormawa)",
      stack: ["Google Apps Script", "Google Sheets"],
      problem: "Belum adanya sistem pendataan dan pemetaan yang terpusat untuk lokasi petani krisan.",
      solution: "Mengintegrasikan Google Sheets sebagai basis data terpusat untuk menyimpan, mengelola, dan menyajikan data lokasi serta profil petani.",
      accent: "blue",
      featured: true,
      status: "published",
    },
  ],
  certificates: [
    {
      id: "cert-1",
      title: "Social Media Sentiment Analysis with Python",
      issuer: "Jatim Developer Day",
      year: "2024",
    },
    {
      id: "cert-2",
      title: "Microsoft Excel Bootcamp",
      issuer: "Karirnex",
      year: "2024",
    },
    {
      id: "cert-3",
      title: "Web for Everyone: Jelajahi Dunia Web Tanpa Takut Coding",
      issuer: "Pasuruan Dev",
      year: "2024",
    },
    {
      id: "ach-1",
      title: "Penerima Program PPK Ormawa",
      issuer: "Kemdikbudristek",
      year: "2025",
    },
    {
      id: "ach-2",
      title: "Penerima Program KOSABANGSA",
      issuer: "Kemdikbudristek",
      year: "2025",
    },
  ],
  gallery: [
    {
      id: "gal-1",
      title: "Croatia",
      subtitle: "Click to learn more",
      imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
      flag: "🇭🇷",
    },
    {
      id: "gal-2",
      title: "Indonesia",
      subtitle: "Click to learn more",
      imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
      flag: "🇮🇩",
    },
    {
      id: "gal-3",
      title: "Italy",
      subtitle: "Click to learn more",
      imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80",
      flag: "🇮🇹",
    },
    {
      id: "gal-4",
      title: "Malta",
      subtitle: "Click to learn more",
      imageUrl: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=800&q=80",
      flag: "🇲🇹",
    },
    {
      id: "gal-5",
      title: "Mauritius",
      subtitle: "Click to learn more",
      imageUrl: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&fit=crop&w=800&q=80",
      flag: "🇲🇺",
    },
  ],
  seo: {
    title: "Taufiqur Rohman S | Data Analyst & Web Developer",
    description: "Portfolio Taufiqur Rohman S, Mahasiswa Teknik Informatika Universitas Yudharta Pasuruan. Berpengalaman dalam Data Analysis dan Web Development.",
    keywords: "Taufiqur Rohman S, Data Analyst, Data Science, Web Developer, Python, Laravel, React.js",
  },
  socialLinks: [
    { label: "GitHub", href: "https://github.com/taufiqurrohmans" },
    { label: "LinkedIn", href: "https://linkedin.com/in/taufiqur-rohman-s-310454295" },
    { label: "Instagram", href: "https://instagram.com/taufiqur____" },
    { label: "Email", href: "mailto:taufiqur.id@gmail.com" },
  ],
};
