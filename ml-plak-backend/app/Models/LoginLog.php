<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class LoginLog extends Model{

    protected $table = 'loginlog';
    protected $fillable = ['user','action','date','time'];

    public $timestamps = false;

    public function usuario()
	{
		return $this->belongsTo(\App\Models\Usuario::class);
	}
}
