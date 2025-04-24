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
        Schema::create('dogadjaji', function (Blueprint $table) {
            $table->id(); 
            $table->string('naziv', 50); 
            $table->date('datum'); 
            $table->string('lokacija', 50); 
            $table->enum('tip_dogadjaja', ['koncert', 'festival', 'predstava', 'konferencija', 'izlozba']); 
            $table->string('opis', 50)->nullable(); 
            $table->decimal('cena', 10, 2);
            $table->unsignedBigInteger('izvodjac_id');
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dogadjaji');
    }
};
