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
            $table->string('naziv', 5000)->change();
            $table->string('lokacija', 5000)->change();
            $table->string('opis', 5000)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dogadjaji', function (Blueprint $table) {
            $table->string('naziv', 50)->change();
            $table->string('lokacija', 50)->change();
            $table->string('opis', 50)->nullable()->change();
        });
    }
};
