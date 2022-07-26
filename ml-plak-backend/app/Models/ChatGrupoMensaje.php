<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatGrupoMensaje extends Model
{
    protected $table = 'chat_grupos_mensajes';
    protected $fillable = ['mensaje', 'tipo', 'usuario_id', 'chat_grupo_id', 'aprobado_usuario_id'];

    public function usuario()
    {
    	return $this->belongsTo(\App\Models\Usuario::class, 'usuario_id', 'id');
    }

    public function aprobado_usuario()
    {
    	return $this->belongsTo(\App\Models\Usuario::class, 'aprobado_usuario_id', 'id');
    }

    public function chat_grupo()
    {
    	return $this->belongsTo(\App\Models\ChatGrupo::class, 'chat_grupo_id', 'id');
    }
}
