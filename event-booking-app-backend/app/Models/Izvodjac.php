<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Izvodjac extends Model
{
    use HasFactory;

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
