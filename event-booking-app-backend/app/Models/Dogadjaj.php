<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Dogadjaj extends Model
{
    use HasFactory;

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
