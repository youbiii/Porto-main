import { Skill, Project, TimelineItem } from './types';

export const PERSONAL_INFO = {
  name: 'Catur Nurul Huda',
  degree: 'S.Kom',
  fullTitle: 'S1 Teknik Informatika',
  faculty: 'Fakultas Teknik',
  university: 'Universitas Pahlawan Tuanku Tambusai',
  nim: '22552010...',
  email: '2224015.catur@universitaspahlawan.ac.id',
  phone: '+62 822-8286-3408',
  location: 'Kampar, Riau, Indonesia',
  bio: 'Halo, saya Catur Nurul Huda — Mahasiswa S1 Teknik Informatika, Fakultas Teknik, Universitas Pahlawan Tuanku Tambusai. Saya tertarik membangun aplikasi web, sistem IoT, dan software yang bermanfaat dengan antarmuka yang bersih, intuitif, dan responsif.',
  github: 'https://github.com/youbiii',
  linkedin: 'https://linkedin.com/in/caturnurulhuda',
  instagram: 'https://www.instagram.com/caturnh_yoo?obrf=MWRoZXl3eGU3MGF5YQ==',
  status: 'Alumni',
};

export const SKILLS: Skill[] = [
  {
    id: '1',
    name: 'HTML5 & CSS3',
    category: 'Frontend',
    level: 95,
    iconName: 'Code',
    description: 'Semantik HTML, Flexbox, CSS Grid, Responsif Layout & Animasi',
  },
  {
    id: '2',
    name: 'JavaScript / TypeScript',
    category: 'Language',
    level: 90,
    iconName: 'FileCode2',
    description: 'ES6+, Async/Await, Type-Safety, DOM Manipulation, Modules',
  },
  {
    id: '3',
    name: 'React.js',
    category: 'Frontend',
    level: 88,
    iconName: 'Atom',
    description: 'Hooks, Context API, React Router, Custom Hooks & Optimization',
  },
  {
    id: '4',
    name: 'Tailwind CSS',
    category: 'Frontend',
    level: 92,
    iconName: 'Palette',
    description: 'Utility-first CSS, Custom Configuration, Dark Mode, Component Styling',
  },
  {
    id: '5',
    name: 'PHP',
    category: 'Backend',
    level: 82,
    iconName: 'Server',
    description: 'OOP PHP, Native Architecture, Rest API, Integration & Session Handling',
  },
  {
    id: '6',
    name: 'Node.js & Express',
    category: 'Backend',
    level: 85,
    iconName: 'Cpu',
    description: 'RESTful Endpoints, Middleware, JWT Auth, Backend Architecture',
  },
  {
    id: '7',
    name: 'MySQL / Database',
    category: 'Database',
    level: 84,
    iconName: 'Database',
    description: 'Relational Schema, Query Optimization, Joins, Indexing & Stored Procedures',
  },
  {
    id: '8',
    name: 'Python',
    category: 'Language',
    level: 78,
    iconName: 'Terminal',
    description: 'Data Processing, Automation, Basic ML & Web Scraping Scripts',
  },
  {
    id: '9',
    name: 'Git & GitHub',
    category: 'Tools & Design',
    level: 88,
    iconName: 'GitBranch',
    description: 'Version Control, Branching Strategy, Pull Requests, Workflows',
  },
  {
    id: '10',
    name: 'Figma',
    category: 'Tools & Design',
    level: 80,
    iconName: 'Figma',
    description: 'UI/UX Wireframing, High-Fidelity Prototyping, Component Systems',
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'proj-iot',
    title: 'Smart Lab Environment & Security (IoT System)',
    description: 'Sistem monitoring & kontrol otomatis ruang lab berbasis ESP32, sensor suhu DHT22, detektor asap MQ-2, dan dashboard realtime.',
    fullDescription: 'Proyek Internet of Things (IoT) yang dirancang untuk memantau kondisi fisik laboratorium secara cerdas dan realtime. Menggunakan mikrokontroler ESP32 yang terhubung ke jaringan WiFi/MQTT untuk mengirimkan telemetry sensor (suhu, kelembaban, dan kualitas udara) ke web dashboard serta mengontrol daya pendingin AC & lampu otomatis.',
    category: 'IoT & System',
    tags: ['ESP32', 'C++ / Arduino', 'MQTT', 'React', 'Node.js', 'Tailwind'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    demoUrl: 'https://example.com/iot-smartlab-demo',
    githubUrl: 'https://github.com/ahmadfahrizal-dev/iot-smartlab-monitoring',
    highlights: [
      'Telemetri sensor realtime dengan latensi < 500ms via WebSocket/MQTT',
      'Sistem peringatan bahaya asap/kebakaran otomatis ke WhatsApp & Email',
      'Kontrol jarak jauh relay daya AC & pencahayaan lab via Dashboard',
      'Visualisasi grafik histori tren suhu dan konsumsi energi'
    ],
  },
  {
    id: 'proj-1',
    title: 'Sistem Informasi Akademik Universitas (SIAKAD)',
    description: 'Portal web terpadu pengurusan KRS, transkrip nilai, dan penjadwalan kuliah berbasis React & Express.',
    fullDescription: 'Sistem Akademik ini dirancang khusus untuk mempermudah alur administrasi perkuliahan mahasiswa, dosen, dan staf administrasi Fakultas Teknik. Memiliki fitur autentikasi berbasis perannya, kalkulasi IPK otomatis, cetak Kartu Hasil Studi (KHS), serta grafik statistik prestasi.',
    category: 'Web App',
    tags: ['React', 'TypeScript', 'Node.js', 'MySQL', 'Tailwind'],
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
    demoUrl: 'https://example.com/siakad-demo',
    githubUrl: 'https://github.com/ahmadfahrizal-dev/siakad-app',
    highlights: [
      'Dashboard statistik interaktif untuk mahasiswa & dosen',
      'Modul verifikasi KRS otomatis dengan batasan SKS',
      'Ekspor transkrip nilai ke PDF siap cetak',
      'Sistem keamanan JWT + Session Hash'
    ],
  },
  {
    id: 'proj-2',
    title: 'Sistem Manajemen Inventaris Laboratorium Komputer',
    description: 'Aplikasi manajemen stok perangkat keras, penjadwalan pemakaian lab, dan log pemeliharaan PC.',
    fullDescription: 'Dirancang untuk Laboratorium Komputer Fakultas Teknik Universitas Pahlawan. Membantu asisten lab mencatat kondisi unit PC, ketersediaan komponen periferal, pelaporan kerusakan alat oleh mahasiswa, dan riwayat perbaikan berkala.',
    category: 'Web App',
    tags: ['PHP Native', 'MySQL', 'Tailwind CSS', 'Chart.js'],
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1200&auto=format&fit=crop',
    demoUrl: 'https://example.com/inv-lab-demo',
    githubUrl: 'https://github.com/ahmadfahrizal-dev/lab-inventory',
    highlights: [
      'Pencatatan kode QR / Barcode unik setiap unit PC',
      'Sistem Tiketing pengaduan kerusakan perangkat',
      'Ekspor laporan bulanan pemeliharaan lab',
      'Notifikasi pemeliharaan rutin otomatis'
    ],
  },
  {
    id: 'proj-3',
    title: 'Portal Klasifikasi & Recomendasi Beasiswa AI',
    description: 'Aplikasi cerdas perekomendasi beasiswa kampus menggunakan algoritma pemetaan kriteria mahasiswa.',
    fullDescription: 'Proyek tugas mandiri yang memanfaatkan ekstraksi data profil mahasiswa (IPK, penghasilan orang tua, prestasi) untuk mencocokkan kelayakan kualifikasi beasiswa (Beasiswa UKT, Prestasi, dan Baznas) secara presisi.',
    category: 'AI & System',
    tags: ['Python', 'React', 'FastAPI', 'Tailwind CSS'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    demoUrl: 'https://example.com/beasiswa-ai',
    githubUrl: 'https://github.com/ahmadfahrizal-dev/beasiswa-ai-matcher',
    highlights: [
      'Skoring kriteria otomatis berdasarkan bobot variabel',
      'Rekomendasi beasiswa yang paling relevan bagi pendaftar',
      'Antarmuka kuesioner langkah-demi-langkah yang intuitif',
      'Ringkasan kelayakan dengan visualisasi grafik batang'
    ],
  },
  {
    id: 'proj-4',
    title: 'Landing Page & Redesain Portal Universitas Pahlawan',
    description: 'Konsep desain modern responsif dan prototipe portal informasi kampus dengan estetika dark/light mode.',
    fullDescription: 'Proyek eksplorasi UI/UX & Frontend untuk memperbarui tampilan informasi fakultas dan program studi Teknik Informatika agar lebih menarik bagi calon mahasiswa baru dan lebih mudah diakses melalui ponsel pintar.',
    category: 'Design / UI',
    tags: ['Figma', 'React', 'Tailwind CSS', 'Framer Motion'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    demoUrl: 'https://example.com/portal-redesign',
    githubUrl: 'https://github.com/ahmadfahrizal-dev/kampus-portal-redesign',
    highlights: [
      'Skor Aksesibilitas Lighthouse 98+',
      'Navigasi responsif intuitif dengan mikro-interaksi',
      'Desain komponen modular berdaya guna tinggi',
      'Sistem berita & agenda kegiatan mahasiswa'
    ],
  },
];

export const TIMELINE: TimelineItem[] = [
  {
    id: 't-1',
    type: 'Education',
    title: 'S1 Teknik Informatika (S.Kom)',
    institution: 'Fakultas Teknik - Universitas Pahlawan Tuanku Tambusai',
    period: '2021 - 2025',
    description: 'Menyelesaikan pendidikan sarjana dengan fokus pada Pemrograman Web, Rekayasa Perangkat Lunak, dan Basis Data. IPK Kumulatif: 3.82.',
    achievements: [
      'Judul Skripsi: Perancangan Sistem Informasi Manajemen Laboratorium Berbasis Web',
      'Juara 2 Lomba Inovasi Aplikasi Web Tingkat Fakultas',
      'Penerima Beasiswa Prestasi Akademik Kampus'
    ]
  },
  {
    id: 't-3',
    type: 'Experience',
    title: 'Web Developer Intern',
    institution: 'PT Riau Digital Nusantara',
    period: 'Agu 2023 - Des 2023',
    description: 'Mengembangkan komponen UI frontend dan mengintegrasikan REST API untuk sistem aplikasi e-government lokal.',
    achievements: [
      'Membangun 15+ komponen React modular dengan Tailwind CSS',
      'Melakukan refactoring kode query MySQL sehingga mempercepat respon API sebesar 30%'
    ]
  },
  {
    id: 't-4',
    type: 'Education',
    title: 'SMK Manajemen Penerbangan Pekanbaru',
    institution: 'SMK Manajemen Penerbangan Pekanbaru',
    period: '2018 - 2021',
    description: 'Menempuh pendidikan kejuruan penerbangan dengan kedisiplinan tinggi, aktif dalam pengembangan teknologi dan kegiatan organisasi sekolah.',
  }
];
