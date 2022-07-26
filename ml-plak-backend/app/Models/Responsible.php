<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Responsible extends Model
{
    //modelo que almacena los id de responsable y demas
    protected $table = 'project_responsible';
    protected $fillable = ['usuario_id'];
    public function proyecto()
	{
        return $this->belongsTo(\App\Models\Proyecto::class);
    }
    
    public function usuario(){
        return $this->belongsTo(\App\Models\Usuario::class)->select(array('id','nombre_completo'));
    }
}
