# 📦 Inventara — Sistem Monitoring & Manajemen Gudang

> Sistem manajemen stok gudang berbasis web dengan alur approval multi-level,
> dibangun menggunakan **Laravel 12** (API) dan **React.js** (Frontend).
> Proyek ini dirancang untuk mendemonstrasikan praktik *engineering discipline*:
> arsitektur yang maintainable, validasi ketat, dan dokumentasi yang jelas.

![Status](https://img.shields.io/badge/status-active-success)
![Laravel](https://img.shields.io/badge/Laravel-12-red?logo=laravel)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Fitur Utama

### 🔐 Multi-Role Authentication
Sistem login berbasis peran menggunakan **Spatie Permission** dengan 3 level akses:
- **Admin** → Akses penuh: kelola user, konfigurasi sistem, audit log
- **Manager** → Approval barang keluar, lihat laporan, monitoring stok
- **Staff** → Input barang masuk/keluar, cek stok real-time

### 📊 Dashboard & Visualisasi Stok
- Grafik interaktif stok masuk vs keluar (harian/mingguan/bulanan)
- Indikator stok kritis (minimum threshold) dengan notifikasi visual
- Ringkasan transaksi terbaru dan item paling aktif

### ✅ Approval Workflow (Barang Keluar)
Alur persetujuan berjenjang untuk pengeluaran barang:
1. **Staff** membuat permintaan barang keluar
2. **Manager** mereview dan approve/reject dengan catatan
3. Stok hanya berkurang **setelah** disetujui
4. Riwayat approval tercatat di audit log

### 📄 Export Laporan
- Export data stok & transaksi ke **PDF** dan **Excel** menggunakan Maatwebsite
- Filter berdasarkan periode, kategori, atau status approval

### 🔍 Audit Trail
Setiap perubahan kritis (stok, approval, user) tercatat dengan:
- Siapa yang melakukan
- Kapan dilakukan (timestamp)
- Nilai sebelum & sesudah
- Alasan/keterangan (jika ada)

---

## 🛠️ Tech Stack

| Layer | Teknologi | Keterangan |
|-------|-----------|------------|
| **Backend** | Laravel 12 (PHP 8.2+) | RESTful API, Sanctum auth, Spatie Permission |
| **Frontend** | React 18 + Vite | SPA, komponen reusable, state management |
| **Styling** | Tailwind CSS 4 | Utility-first, responsive design |
| **Database** | MySQL | Relational, dengan indexing untuk performa |
| **Export** | Maatwebsite Excel | PDF & Excel generation |
| **Dev Tools** | Laravel Debugbar, Vite HMR | Developer experience yang optimal |

---

## 🚀 Cara Menjalankan Lokal

Proyek ini **tidak memerlukan Docker**. Cukup gunakan XAMPP/Laragon atau environment PHP lokal.

### Prasyarat
- PHP 8.2 atau lebih baru
- Composer
- Node.js 18+ & npm
- MySQL (via XAMPP/Laragon/standalone)

### Langkah Instalasi

```bash
# 1. Clone repository
git clone https://github.com/25552011188-cmyk/Inventara.git
cd Inventara

# 2. Install dependencies backend
composer install

# 3. Install dependencies frontend
npm install

# 4. Setup environment
cp .env.example .env
php artisan key:generate
```

### Konfigurasi Database

Buka file `.env` dan sesuaikan:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=inventara
DB_USERNAME=root
DB_PASSWORD=
```

### Migrasi & Seeder

```bash
php artisan migrate --seed
```

> Perintah ini akan membuat tabel dan mengisi data dummy (user, kategori, barang) untuk testing.

### Jalankan Aplikasi

Buka **2 terminal** yang berbeda:

**Terminal 1** — Laravel server:
```bash
php artisan serve
```

**Terminal 2** — Vite (hot reload untuk React):
```bash
npm run dev
```

### Akses Aplikasi

Buka browser: **http://localhost:8000**

### Akun Default (setelah seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@inventara.test | password |
| Manager | manager@inventara.test | password |
| Staff | staff@inventara.test | password |

---

## 🧪 Testing

```bash
composer run test
```

---

## 📁 Struktur Proyek

```
inventara/
├── app/
│   ├── Http/Controllers/Api/     # API endpoints
│   ├── Models/                   # Eloquent models
│   └── Policies/                 # Authorization logic
├── frontend/
│   └── src/
│       ├── components/           # Reusable UI (Button, Modal, Table)
│       ├── pages/                # Dashboard, Stok, Approval
│       ├── services/             # API client (Axios)
│       └── hooks/                # Custom React hooks
├── database/
│   ├── migrations/               # Skema database
│   └── seeders/                  # Data dummy
├── routes/
│   ├── api.php                   # API routes
│   └── web.php                   # Web routes
└── tests/
    └── Feature/                  # Feature tests
```

---

## 🎯 Learning Outcomes

Proyek ini mendemonstrasikan pemahaman tentang:
- ✅ RESTful API Design
- ✅ Role-Based Access Control (Spatie Permission)
- ✅ Workflow State Machine (Approval Flow)
- ✅ SPA Architecture (React + Laravel API)
- ✅ Database Design (Normalisasi, Indexing, Audit Trail)
- ✅ Feature Testing

---

## 📄 Lisensi

Proyek ini berada di bawah lisensi **MIT License**.

---

## 📧 Kontak

Dibangun dengan ❤️ oleh **Fahmi**
GitHub: [@25552011188-cmyk](https://github.com/25552011188-cmyk)
