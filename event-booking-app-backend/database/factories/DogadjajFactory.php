<?php

namespace Database\Factories;

use App\Models\Dogadjaj;
use App\Models\Izvodjac;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class DogadjajFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Dogadjaj::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'naziv' => $this->faker->sentence(3), 
            'datum' => $this->faker->dateTimeBetween('+1 week', '+1 year'), 
            'lokacija' => $this->faker->city, 
            'tip_dogadjaja' => $this->faker->randomElement(['koncert', 'festival', 'predstava', 'konferencija', 'izlozba']), 
            'opis' => $this->faker->paragraph, 
            'izvodjac_id' => Izvodjac::factory(), 
        ];
    }
}
