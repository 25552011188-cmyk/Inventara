<?php

namespace App\Providers;

use App\Models\Barang;
use App\Observers\BarangObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Barang::observe(BarangObserver::class);
    }
}