<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class SettingController extends Controller
{
    public function getSettings()
    {
        $logo = DB::table('settings')->where('key', 'app_logo')->first();
        $logoUrl = $logo && $logo->value ? asset('uploads/logos/' . $logo->value) : null;

        return response()->json([
            'logo_url' => $logoUrl
        ]);
    }

    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $file = $request->file('logo');
        $folder = public_path('uploads/logos');
        
        // Buat folder kalau belum ada
        if (!File::exists($folder)) {
            File::makeDirectory($folder, 0755, true);
        }

        // Hapus logo lama kalau ada
        $oldLogo = DB::table('settings')->where('key', 'app_logo')->first();
        if ($oldLogo && $oldLogo->value) {
            $oldPath = $folder . '/' . $oldLogo->value;
            if (File::exists($oldPath)) {
                File::delete($oldPath);
            }
        }

        // Simpan logo baru
        $filename = time() . '.' . $file->getClientOriginalExtension();
        $file->move($folder, $filename);

        // Update database
        DB::table('settings')->updateOrInsert(
            ['key' => 'app_logo'],
            ['value' => $filename, 'updated_at' => now()]
        );

        return response()->json([
            'message' => 'Logo berhasil diupdate',
            'logo_url' => asset('uploads/logos/' . $filename)
        ]);
    }
}