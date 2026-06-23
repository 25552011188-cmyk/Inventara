<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $fillable = [
        'nama_supplier',
        'email',
        'telepon',
        'alamat'
    ];

    public function barang()
    {
        return $this->hasMany(Barang::class);
    }
}