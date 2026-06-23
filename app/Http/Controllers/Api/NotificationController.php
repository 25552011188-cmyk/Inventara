<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function getNotifications(Request $request)
    {
        try {
            $user = $request->user();
            
            return response()->json([
                'unread' => $user->unreadNotifications()->latest()->take(10)->get(),
                'all' => $user->notifications()->latest()->take(20)->get(),
                'unread_count' => $user->unreadNotifications()->count(),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function markAsRead($id, Request $request)
    {
        try {
            $notification = $request->user()->notifications()->findOrFail($id);
            $notification->markAsRead();
            
            return response()->json(['message' => 'Notifikasi ditandai sudah dibaca']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function markAllAsRead(Request $request)
    {
        try {
            $request->user()->unreadNotifications->markAsRead();
            
            return response()->json(['message' => 'Semua notifikasi sudah dibaca']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function delete($id, Request $request)
    {
        try {
            $notification = $request->user()->notifications()->findOrFail($id);
            $notification->delete();
            
            return response()->json(['message' => 'Notifikasi dihapus']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}