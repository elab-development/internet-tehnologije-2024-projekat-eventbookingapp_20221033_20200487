<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Dogadjaj;

class DogadjajSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Dogadjaj::factory()->count(20)->create();
    }
}
