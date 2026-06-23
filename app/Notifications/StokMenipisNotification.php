<?php

namespace App\Notifications;

use App\Models\Barang;
use Illuminate\Notifications\Notification;

class StokMenipisNotification extends Notification
{
    public function __construct(private Barang $barang) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable): array
    {
        return [
            'barang_id'   => $this->barang->id,
            'kode_barang' => $this->barang->kode_barang,
            'nama_barang' => $this->barang->nama_barang,
            'stok'        => $this->barang->stok,
            'stok_minimum'=> $this->barang->stok_minimum,
            'pesan'       => "Stok {$this->barang->nama_barang} menipis! Sisa {$this->barang->stok} unit (minimum: {$this->barang->stok_minimum})",
            'tipe'        => $this->barang->stok === 0 ? 'stok_habis' : 'stok_menipis',
        ];
    }
}