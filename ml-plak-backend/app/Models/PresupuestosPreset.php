<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PresupuestosPreset extends Model
{
    protected $table = 'presupuestos_preset';
    protected $fillable = ['nombre', 'result', 'predeterminado'];
    public $timestamps  = false;
}
