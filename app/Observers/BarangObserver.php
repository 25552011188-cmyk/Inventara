<?php

namespace App\Observers;

use App\Models\Barang;
use App\Models\User;
use App\Notifications\StokMenipisNotification;
use Illuminate\Support\Facades\Notification;

class BarangObserver
{
    public function updated(Barang $barang): void
    {
        // Hanya trigger jika kolom stok yang berubah
        if (!$barang->wasChanged('stok')) {
            return;
        }

        // Trigger jika stok menyentuh atau di bawah minimum
        if ($barang->stok <= $barang->stok_minimum) {
            $admins = User::role('Admin')->get();

            if ($admins->isNotEmpty()) {
                Notification::send($admins, new StokMenipisNotification($barang));
            }
        }
    }
}