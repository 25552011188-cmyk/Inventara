<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('forecastings', function (Blueprint $table) {
            // Hapus kolom lama yang tidak sesuai
            $table->dropColumn(['bulan', 'prediksi_stok', 'metode']);
        });

        Schema::table('forecastings', function (Blueprint $table) {
            // Kolom baru yang sesuai dengan ForecastService
            $table->string('periode');           // format: 2026-06
            $table->integer('forecast_jumlah');
            $table->integer('safety_stock');
            $table->integer('reorder_point');
            $table->string('metode')->default('WMA');
            $table->json('data_historis')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('forecastings', function (Blueprint $table) {
            $table->dropColumn([
                'periode',
                'forecast_jumlah',
                'safety_stock',
                'reorder_point',
                'metode',
                'data_historis',
            ]);
        });

        Schema::table('forecastings', function (Blueprint $table) {
            $table->string('bulan');
            $table->integer('prediksi_stok');
            $table->string('metode');
        });
    }
};