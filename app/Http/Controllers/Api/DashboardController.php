<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\BarangKeluar;
use App\Models\BarangMasuk;
use App\Models\Category;
use App\Models\Supplier;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $today     = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();

        return response()->json([

            // === Ringkasan Utama ===
            'ringkasan' => [
                'total_barang'    => Barang::count(),
                'total_kategori'  => Category::count(),
                'total_supplier'  => Supplier::count(),
                'total_stok'      => Barang::sum('stok'),
                'nilai_stok'      => Barang::sum(
                    DB::raw('stok * harga_beli')
                ),
            ],

            // === Stok Kritis ===
            'stok_kritis' => [
                'stok_menipis' => Barang::whereColumn('stok', '<=', 'stok_minimum')
                    ->where('stok', '>', 0)
                    ->count(),
                'stok_habis'   => Barang::where('stok', 0)->count(),
                'daftar_menipis' => Barang::with(['category', 'supplier'])
                    ->whereColumn('stok', '<=', 'stok_minimum')
                    ->orderBy('stok')
                    ->limit(5)
                    ->get(['id', 'kode_barang', 'nama_barang', 'stok', 'stok_minimum']),
            ],

            // === Aktivitas Hari Ini ===
            'hari_ini' => [
                'barang_masuk'  => BarangMasuk::whereDate('created_at', $today)
                    ->sum('jumlah'),
                'barang_keluar' => BarangKeluar::whereDate('created_at', $today)
                    ->where('status', 'approved')
                    ->sum('jumlah'),
                'pending_keluar' => BarangKeluar::where('status', 'pending')->count(),
            ],

            // === Aktivitas Bulan Ini ===
            'bulan_ini' => [
                'total_masuk'  => BarangMasuk::where('created_at', '>=', $thisMonth)
                    ->sum('jumlah'),
                'total_keluar' => BarangKeluar::where('created_at', '>=', $thisMonth)
                    ->where('status', 'approved')
                    ->sum('jumlah'),
                'transaksi_masuk'  => BarangMasuk::where('created_at', '>=', $thisMonth)
                    ->count(),
                'transaksi_keluar' => BarangKeluar::where('created_at', '>=', $thisMonth)
                    ->where('status', 'approved')
                    ->count(),
            ],

            // === Grafik 7 Hari Terakhir ===
            'grafik_mingguan' => $this->getGrafikMingguan(),

            // === Top 5 Barang Paling Banyak Keluar Bulan Ini ===
            'top_barang_keluar' => $this->getTopBarangKeluar($thisMonth),

        ]);
    }

    private function getGrafikMingguan(): array
    {
        return collect(range(6, 0))
            ->map(function ($i) {
                $date = Carbon::today()->subDays($i);
                return [
                    'tanggal' => $date->toDateString(),
                    'hari'    => $date->translatedFormat('D'),
                    'masuk'   => BarangMasuk::whereDate('created_at', $date)
                        ->sum('jumlah'),
                    'keluar'  => BarangKeluar::whereDate('created_at', $date)
                        ->where('status', 'approved')
                        ->sum('jumlah'),
                ];
            })
            ->values()
            ->toArray();
    }

    private function getTopBarangKeluar(Carbon $dari): array
    {
        return BarangKeluar::with('barang:id,nama_barang,kode_barang')
            ->where('status', 'approved')
            ->where('created_at', '>=', $dari)
            ->select('barang_id', DB::raw('SUM(jumlah) as total_keluar'))
            ->groupBy('barang_id')
            ->orderByDesc('total_keluar')
            ->limit(5)
            ->get()
            ->map(fn($item) => [
                'barang'       => $item->barang->nama_barang ?? '-',
                'kode'         => $item->barang->kode_barang ?? '-',
                'total_keluar' => $item->total_keluar,
            ])
            ->toArray();
    }
}