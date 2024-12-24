<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Rezervacija;

class RezervacijaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Rezervacija::factory()->count(20)->create();
    }
}
