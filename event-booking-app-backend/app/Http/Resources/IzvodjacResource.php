<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IzvodjacResource extends JsonResource
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
            'ime' => $this->ime,
            'zanr' => $this->zanr,
            'link_slike'    => $this->link_slike,   
            'biografija' => $this->biografija,
        ];
    }
}
