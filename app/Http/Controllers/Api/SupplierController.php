<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index()
    {
        return response()->json(
            Supplier::latest()->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_supplier' => 'required|max:255',
            'email' => 'nullable|email',
            'telepon' => 'nullable|max:20',
            'alamat' => 'nullable'
        ]);

        $supplier = Supplier::create($validated);

        return response()->json([
            'message' => 'Supplier berhasil dibuat',
            'data' => $supplier
        ], 201);
    }

    public function show(Supplier $supplier)
    {
        return response()->json($supplier);
    }

    public function update(Request $request, Supplier $supplier)
    {
        $validated = $request->validate([
            'nama_supplier' => 'required|max:255',
            'email' => 'nullable|email',
            'telepon' => 'nullable|max:20',
            'alamat' => 'nullable'
        ]);

        $supplier->update($validated);

        return response()->json([
            'message' => 'Supplier berhasil diupdate',
            'data' => $supplier
        ]);
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();

        return response()->json([
            'message' => 'Supplier berhasil dihapus'
        ]);
    }
}