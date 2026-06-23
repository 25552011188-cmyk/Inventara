<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use Illuminate\Http\Request;
use App\Notifications\LowStockNotification;
use App\Models\User;

class BarangController extends Controller
{
    public function index()
    {
        return response()->json(
            Barang::with(['category', 'supplier'])->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_barang' => 'required|string|unique:barangs,kode_barang',
            'nama_barang' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'stok' => 'required|integer|min:0',
            'stok_minimum' => 'required|integer|min:0',
            'harga_beli' => 'required|numeric',
            'harga_jual' => 'required|numeric',
            'satuan' => 'required|string',
        ]);

        $barang = Barang::create($validated);

        // Cek apakah stok di bawah minimum
        if ($barang->stok <= $barang->stok_minimum) {
            $admins = User::where('role', 'Admin')->orWhere('role', 'Manager')->get();
            foreach ($admins as $admin) {
                $admin->notify(new LowStockNotification($barang));
            }
        }

        return response()->json($barang, 201);
    }


    public function show(Barang $barang)
    {
        return response()->json(
            $barang->load(['category', 'supplier'])
        );
    }

    public function update(Request $request, Barang $barang)
    {
        $validated = $request->validate([
            'kode_barang' => 'required|string|unique:barangs,kode_barang,' . $barang->id,
            'nama_barang' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'stok' => 'required|integer|min:0',
            'stok_minimum' => 'required|integer|min:0',
            'harga_beli' => 'required|numeric',
            'harga_jual' => 'required|numeric',
            'satuan' => 'required|string',
        ]);

        $barang->update($validated);

        // Cek apakah stok di bawah minimum
        if ($barang->stok <= $barang->stok_minimum) {
            $admins = User::where('role', 'Admin')->orWhere('role', 'Manager')->get();
            foreach ($admins as $admin) {
                $admin->notify(new LowStockNotification($barang));
            }
        }

        return response()->json($barang);
    }
    public function destroy(Barang $barang)
    {
        // Cegah hapus barang jika masih ada stok
        if ($barang->stok > 0) {
            return response()->json([
                'message' => 'Barang tidak bisa dihapus karena masih ada stok'
            ], 400);
        }

        $barang->delete();

        return response()->json([
            'message' => 'Barang berhasil dihapus'
        ]);
    }
}