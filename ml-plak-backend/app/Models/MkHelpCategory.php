<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class MkHelpCategory extends Authenticatable 
{
    # public $timestamps = false;
	protected $table      = 'mk_ayudas_categorias';
	protected $fillable   = ['id','desc_categoria', 'activo'];
	# protected $primaryKey = 'tar_nid';

}
