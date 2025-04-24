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
            $table->string('biografija', 5000)->nullable()->after('zanr'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('izvodjaci', function (Blueprint $table) {
            $table->dropColumn('biografija'); 
        });
    }
};
