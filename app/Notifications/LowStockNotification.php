<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class LowStockNotification extends Notification
{
    use Queueable;

    protected $barang;

    public function __construct($barang)
    {
        $this->barang = $barang;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'low_stock',
            'message' => "Stok {$this->barang->nama_barang} menipis! Sisa: {$this->barang->stok}",
            'barang_id' => (int)$this->barang->id,
            'barang_nama' => $this->barang->nama_barang,
            'stok' => (int)$this->barang->stok,
            'stok_minimum' => (int)$this->barang->stok_minimum,
        ];
    }
}