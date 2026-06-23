<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $roles): Response
    {
        // Pisahkan role yang dipisahkan oleh tanda '|' (misal: Admin|Manager)
        $allowedRoles = explode('|', $roles);

        // Cek apakah user sudah login dan punya role yang sesuai
        // Asumsi: Tabel users kamu punya kolom bernama 'role'
        if (!$request->user() || !in_array($request->user()->role, $allowedRoles)) {
            return response()->json([
                'message' => 'Unauthorized. You do not have the required role.'
            ], 403);
        }

        return $next($request);
    }
}