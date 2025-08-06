<?php

namespace Database\Factories;

use App\Models\Dogadjaj;
use App\Models\Izvodjac;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Http;

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
        $pexelsKey = env('PEXELS_API_KEY');
        $imageUrl = null;

        if ($pexelsKey) {
            // Fetch a batch of photos and pick one at random
            $perPage = 15;
            $response = Http::withHeaders([
                'Authorization' => $pexelsKey,
            ])->get('https://api.pexels.com/v1/search', [
                'query'    => $this->faker->randomElement(['concert', 'festival', 'performance', 'conference']),
                'per_page' => $perPage,
                // optionally pick a random page to vary results further
                'page'     => rand(1, 5),
            ]);

            if ($response->successful() && !empty($response['photos'])) {
                $photos = $response['photos'];
                $randomPhoto = $photos[array_rand($photos)];
                $imageUrl = data_get($randomPhoto, 'src.medium');
            }
        }

        return [
            'naziv'         => $this->faker->sentence(3),
            'datum'         => $this->faker->dateTimeBetween('+1 week', '+1 year'),
            'lokacija'      => $this->faker->city,
            'tip_dogadjaja' => $this->faker->randomElement(['koncert', 'festival', 'predstava', 'konferencija', 'izlozba']),
            'opis'          => $this->faker->paragraph,
            'cena'          => $this->faker->randomFloat(2, 100, 10000),
            'izvodjac_id'   => Izvodjac::factory(),
            'link_slike'    => $imageUrl ?: $this->faker->imageUrl(800, 600),
        ];
    }
}
