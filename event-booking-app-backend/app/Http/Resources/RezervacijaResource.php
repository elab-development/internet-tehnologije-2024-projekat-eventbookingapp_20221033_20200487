<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RezervacijaResource extends JsonResource
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
            'datum' => $this->datum,
            'status' => $this->status,
            'broj_karata' => $this->broj_karata,
            'tip_karti' => $this->tip_karti,
            'recenzija' => $this->recenzija,
            'dogadjaj' => new DogadjajResource($this->whenLoaded('dogadjaj')),
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
