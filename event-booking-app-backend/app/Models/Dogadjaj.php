<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dogadjaj extends Model
{
    protected $table = 'dogadjaji';

    protected $fillable = [
        'naziv',
        'datum',
        'lokacija',
        'tip_dogadjaja',
        'opis',
        'izvodjac_id',
    ];

    public function izvodjac()
    {
        return $this->belongsTo(Izvodjac::class, 'izvodjac_id');
    }

    public function rezervacije()
    {
        return $this->hasMany(Rezervacija::class, 'dogadjaj_id');
    }
}
