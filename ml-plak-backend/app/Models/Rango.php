<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rango extends Model
{
	protected $table    = 'rangos';
	protected $fillable = ['nombre','valor','suma_no_remunerativa'];
}
