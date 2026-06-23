<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class PendingApprovalNotification extends Notification
{
    use Queueable;

    protected $barangKeluar;

    public function __construct($barangKeluar)
    {
        $this->barangKeluar = $barangKeluar;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'barang_keluar_id' => $this->barangKeluar->id,
            'barang_nama' => $this->barangKeluar->barang->nama_barang ?? 'Unknown',
            'jumlah' => $this->barangKeluar->jumlah,
            'type' => 'pending_approval',
            'message' => "Ada permintaan barang keluar: {$this->barangKeluar->barang->nama_barang} ({$this->barangKeluar->jumlah} pcs)",
        ];
    }
}