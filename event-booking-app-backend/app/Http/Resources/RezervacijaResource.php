<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RezervacijaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        // Ensure the related dogadjaj is loaded so we can access its price
        $cenaPoKarti = $this->dogadjaj->cena ?? 0;
        $ukupnaCena  = $cenaPoKarti * $this->broj_karata;

        return [
            'id'             => $this->id,
            'datum'          => $this->datum,
            'status'         => $this->status,
            'broj_karata'    => $this->broj_karata,
            'tip_karti'      => $this->tip_karti,
            'recenzija'      => $this->recenzija,

            // New price fields:
            'cena_karte'     => $cenaPoKarti,      // Cena jedne karte u RSD
            'ukupna_cena'    => $ukupnaCena,       // Cena po karti * broj karata
            'napomena_cene'  => "Ukupna cena se računa kao cena karte ({$cenaPoKarti} RSD) pomnožena sa brojem karata ({$this->broj_karata}).",

            'dogadjaj'       => new DogadjajResource($this->whenLoaded('dogadjaj')),
            'korisnik'       => $this->whenLoaded('korisnik', function() {
                                   return [
                                     'id'   => $this->korisnik->id,
                                     'name' => $this->korisnik->name,
                                   ];
            }),
            'created_at'     => $this->created_at->toDateTimeString(),
            'updated_at'     => $this->updated_at->toDateTimeString(),
        ];
    }
}
