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
        Schema::create('rezervacije', function (Blueprint $table) {
            $table->id();
            $table->date('datum'); 
            $table->enum('status', ['neplaceno', 'placeno']); 
            $table->integer('broj_karata'); 
            $table->enum('tip_karti', ['regularna', 'vip', 'gold']); 
            $table->string('recenzija', 5000)->nullable(); 
            $table->unsignedBigInteger('korisnik_id');
            $table->unsignedBigInteger('dogadjaj_id');
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rezervacije');
    }
};
