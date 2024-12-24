<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DogadjajResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'naziv' => $this->naziv,
            'datum' => $this->datum,
            'lokacija' => $this->lokacija,
            'tip_dogadjaja' => $this->tip_dogadjaja,
            'opis' => $this->opis,
            'izvodjac' => new IzvodjacResource($this->whenLoaded('izvodjac')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
