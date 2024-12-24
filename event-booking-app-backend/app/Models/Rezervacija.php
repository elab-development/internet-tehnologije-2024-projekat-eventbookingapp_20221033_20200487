<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rezervacija extends Model
{
    protected $table = 'rezervacije';

    protected $fillable = [
        'datum',
        'status', 
        'broj_karata',
        'tip_karti',
        'recenzija', 
        'korisnik_id',
        'dogadjaj_id',
    ];

    public function korisnik()
    {
        return $this->belongsTo(User::class, 'korisnik_id');
    }

    public function dogadjaj()
    {
        return $this->belongsTo(Dogadjaj::class, 'dogadjaj_id');
    }
}