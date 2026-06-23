<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Forecasting extends Model
{
    protected $table = 'forecastings';

    protected $fillable = [
        'barang_id',
        'periode',
        'forecast_jumlah',
        'safety_stock',
        'reorder_point',
        'metode',
        'data_historis',
    ];

    protected $casts = [
        'data_historis'   => 'array',
        'forecast_jumlah' => 'integer',
        'safety_stock'    => 'integer',
        'reorder_point'   => 'integer',
    ];

    public function barang()
    {
        return $this->belongsTo(Barang::class);
    }
}