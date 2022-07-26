<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Foundation\Auth\User as Authenticatable;
use OwenIt\Auditing\Contracts\Auditable;

class Chatmensajes extends Authenticatable
{
    public $timestamps = false;
	protected $table      = 'mk_chatmensaje';
	protected $fillable   = ['user_enviox_nid','chtm_mensaje','chtm_tipo','user_nid_destinatario','chtm_dfechacrea','chtm_nvisto'];
	protected $primaryKey = 'chtm_nid';

}


