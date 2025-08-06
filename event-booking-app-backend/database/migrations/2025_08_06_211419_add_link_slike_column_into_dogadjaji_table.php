<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
    {
        Schema::table('dogadjaji', function (Blueprint $table) {
            $table->longText('link_slike')
                  ->after('izvodjac_id')
                  ->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('dogadjaji', function (Blueprint $table) {
            $table->dropColumn('link_slike');
        });
    }
};
