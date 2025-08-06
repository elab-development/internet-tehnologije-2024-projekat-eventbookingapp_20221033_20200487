<?php

namespace Database\Factories;

use App\Models\Izvodjac;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Http;

class IzvodjacFactory extends Factory
{
    protected $model = Izvodjac::class;

    public function definition(): array
    {
        $pexelsKey = env('PEXELS_API_KEY');
        $imageUrl  = null;

        if ($pexelsKey) {
            // pick a random page & query for variety
            $perPage    = 15;
            $randomPage = rand(1, 5);
            $query      = $this->faker->randomElement([
                'musician portrait',
                'band performance',
                'artist photo'
            ]);

            $response = Http::withHeaders([
                'Authorization' => $pexelsKey,
            ])->get('https://api.pexels.com/v1/search', [
                'query'    => $query,
                'per_page' => $perPage,
                'page'     => $randomPage,
            ]);

            if ($response->successful() && !empty($response['photos'])) {
                $photos      = $response['photos'];
                $randomPhoto = $photos[array_rand($photos)];
                // use 'landscape' for a wider image
                $imageUrl    = data_get($randomPhoto, 'src.landscape');
            }
        }

        return [
            'ime'        => $this->faker->name,
            'zanr'       => $this->faker->randomElement([
                'pop','folk','rep','rok','klasika','tehno','narodna'
            ]),
            'biografija' => $this->faker->paragraphs(3, true),
            'link_slike' => $imageUrl ?: $this->faker->imageUrl(800, 600),
        ];
    }
}
