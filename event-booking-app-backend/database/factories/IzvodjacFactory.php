<?php

namespace Database\Factories;

use App\Models\Izvodjac;
use Illuminate\Database\Eloquent\Factories\Factory;

class IzvodjacFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Izvodjac::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ime' => $this->faker->name,
            'zanr' => $this->faker->randomElement(['pop', 'folk', 'rep', 'rok', 'klasika', 'tehno', 'narodna']),
            'biografija' => $this->faker->paragraphs(3, true), 
        ];
    }
}
