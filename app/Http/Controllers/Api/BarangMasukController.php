<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\BarangMasuk;
use Illuminate\Http\Request;

class BarangMasukController extends Controller
{
    public function index()
    {
        return response()->json(
            BarangMasuk::with(['barang', 'user'])->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'barang_id'  => 'required|exists:barang,id',
            'jumlah'     => 'required|integer|min:1',
            'tanggal'    => 'required|date',
            'keterangan' => 'nullable|string|max:500'
        ]);

        $validated['user_id'] = $request->user()->id; // ✅ dari token

        $barangMasuk = BarangMasuk::create($validated);

        Barang::findOrFail($validated['barang_id'])
            ->increment('stok', $validated['jumlah']);

        return response()->json([
            'message' => 'Barang masuk berhasil',
            'data'    => $barangMasuk->load(['barang', 'user'])
        ], 201);
    }

    public function show(BarangMasuk $barangMasuk)
    {
        return response()->json(
            $barangMasuk->load(['barang', 'user'])
        );
    }

    public function destroy(BarangMasuk $barangMasuk)
    {
        return response()->json([
            'message' => 'Data tidak boleh dihapus'
        ], 403);
    }
}