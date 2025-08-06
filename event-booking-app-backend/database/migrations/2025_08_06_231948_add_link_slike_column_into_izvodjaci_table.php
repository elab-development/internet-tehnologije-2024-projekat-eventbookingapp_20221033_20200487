<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('izvodjaci', function (Blueprint $table) {
            // 'text' for very large strings, nullable, right after 'biografija'
            $table->text('link_slike')->nullable()->after('biografija');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('izvodjaci', function (Blueprint $table) {
            $table->dropColumn('link_slike');
        });
    }
};
