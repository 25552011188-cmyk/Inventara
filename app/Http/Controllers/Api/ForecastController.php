<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ForecastService;
use Illuminate\Http\Request;

class ForecastController extends Controller
{
    public function __construct(
        private ForecastService $forecastService
    ) {}

    public function index(Request $request)
    {
        $request->validate([
            'barang_id' => 'required|exists:barang,id',
            'periode'   => 'nullable|integer|min:2|max:12',
        ]);

        $result = $this->forecastService->forecast(
            barangId: (int) $request->barang_id,
            periode:  (int) ($request->periode ?? 3),
        );

        return response()->json($result);
    }
}