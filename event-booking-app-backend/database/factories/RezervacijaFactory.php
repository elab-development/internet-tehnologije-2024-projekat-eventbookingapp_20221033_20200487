<?php

namespace Database\Factories;

use App\Models\Rezervacija;
use App\Models\User;
use App\Models\Dogadjaj;
use Illuminate\Database\Eloquent\Factories\Factory;

class RezervacijaFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Rezervacija::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'datum' => $this->faker->dateTimeBetween('now', '+1 year'), 
            'status' => $this->faker->randomElement(['neplaceno', 'placeno']), 
            'broj_karata' => $this->faker->numberBetween(1, 10),
            'tip_karti' => $this->faker->randomElement(['regularna', 'vip', 'gold']), 
            'recenzija' => $this->faker->optional()->text(500), 
            'korisnik_id' => User::factory(), 
            'dogadjaj_id' => Dogadjaj::factory(),
        ];
    }
}
