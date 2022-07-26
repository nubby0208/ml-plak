<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Session extends Model{

    protected $table = 'session';
    protected $fillable = ['user','usuario_id','lastlogin','time_in'];

    public $timestamps = false;
    
    public function usuario()
	{
		return $this->belongsTo(\App\Models\Usuario::class);
	}
}