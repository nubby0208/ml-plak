<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Imagesfolder extends Model
{
	protected $table    = 'folders_info';
	protected $fillable = ['token_project','folder_name','folder_des','files'];
	//public $timestamps  = false;

	public function Imagesfolder()
	{
		return $this->hasMany(\App\Models\Imagesfolder::class);
	}

    
}
