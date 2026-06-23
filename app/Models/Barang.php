<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    protected $table = 'barang';

    protected $fillable = [
        'kode_barang',
        'nama_barang',
        'category_id',
        'supplier_id',
        'stok',
        'stok_minimum',
        'harga_beli',
        'harga_jual',
        'barcode',
        'deskripsi',
    ];

    protected $casts = [
        'stok'         => 'integer',
        'stok_minimum' => 'integer',
        'harga_beli'   => 'decimal:2',
        'harga_jual'   => 'decimal:2',
    ];

    // Accessor — apakah stok menipis
    public function getStokAmanAttribute(): bool
    {
        return $this->stok > $this->stok_minimum;
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function barangMasuk()
    {
        return $this->hasMany(BarangMasuk::class);
    }

    public function barangKeluar()
    {
        return $this->hasMany(BarangKeluar::class);
    }
}