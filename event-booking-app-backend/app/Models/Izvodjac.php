<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Izvodjac extends Model
{
    protected $table = 'izvodjaci';

    protected $fillable = [
        'ime',
        'zanr',
        'biografija',
    ];

    public function dogadjaji()
    {
        return $this->hasMany(Dogadjaj::class, 'izvodjac_id');
    }

}
