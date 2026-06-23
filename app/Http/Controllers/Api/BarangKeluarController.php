<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BarangKeluar;
use Illuminate\Http\Request;
use App\Notifications\PendingApprovalNotification;
use App\Models\User;

class BarangKeluarController extends Controller
{
    // JANGAN ADA CONSTRUCTOR DI SINI!
    // Kalau ada __construct() dengan middleware, HAPUS!

    public function index()
    {
        return response()->json(BarangKeluar::with('barang')->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'barang_id' => 'required|exists:barangs,id',
            'jumlah' => 'required|integer|min:1',
            'tanggal' => 'required|date',
            'keterangan' => 'nullable|string',
        ]);

        $barangKeluar = BarangKeluar::create([
            ...$validated,
            'status' => 'pending',
        ]);

        // Kirim notifikasi ke semua Admin dan Manager
        $admins = User::where('role', 'Admin')->orWhere('role', 'Manager')->get();
        foreach ($admins as $admin) {
            $admin->notify(new PendingApprovalNotification($barangKeluar));
        }

        return response()->json($barangKeluar, 201);
    }
    public function approve($id)
    {
        // TIDAK ADA PENGECEKAN ROLE DI SINI!

        $barangKeluar = BarangKeluar::with('barang')->findOrFail($id);

        if ($barangKeluar->barang->stok < $barangKeluar->jumlah) {
            return response()->json(['message' => 'Stok tidak cukup'], 400);
        }

        $barangKeluar->update(['status' => 'approved']);
        $barangKeluar->barang->decrement('stok', $barangKeluar->jumlah);

        return response()->json(['message' => 'Barang keluar disetujui']);
    }

    public function reject($id)
    {
        // TIDAK ADA PENGECEKAN ROLE DI SINI JUGA!

        $barangKeluar = BarangKeluar::findOrFail($id);
        $barangKeluar->update(['status' => 'rejected']);

        return response()->json(['message' => 'Barang keluar ditolak']);
    }
}