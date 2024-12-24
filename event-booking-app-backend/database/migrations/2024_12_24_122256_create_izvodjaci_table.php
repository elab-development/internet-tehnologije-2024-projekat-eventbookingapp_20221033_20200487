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
        Schema::create('izvodjaci', function (Blueprint $table) {
            $table->id(); 
            $table->string('ime', 5000); 
            $table->enum('zanr', ['pop', 'folk', 'rep', 'rok', 'klasika', 'tehno', 'narodna']); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('izvodjaci');
    }
};
