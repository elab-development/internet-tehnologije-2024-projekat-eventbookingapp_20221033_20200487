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
        Schema::table('dogadjaji', function (Blueprint $table) {
            $table->foreign('izvodjac_id')
                ->references('id')
                ->on('izvodjaci')
                ->onDelete('cascade'); 
        });
        Schema::table('rezervacije', function (Blueprint $table) {
            $table->foreign('korisnik_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade'); 
            $table->foreign('dogadjaj_id')
                ->references('id')
                ->on('dogadjaji')
                ->onDelete('cascade'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dogadjaji', function (Blueprint $table) {
            $table->dropForeign(['izvodjac_id']);
        });
        Schema::table('rezervacije', function (Blueprint $table) {
            $table->dropForeign(['korisnik_id']);
            $table->dropForeign(['dogadjaj_id']);
        });
    }
};
