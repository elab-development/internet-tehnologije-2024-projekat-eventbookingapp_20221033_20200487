<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Izvodjac;

class IzvodjacSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Izvodjac::factory()->count(15)->create();
    }
}
