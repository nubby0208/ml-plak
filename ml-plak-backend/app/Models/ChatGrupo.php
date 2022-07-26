<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Usuario;

class ChatGrupo extends Model
{
    protected $table = 'chat_grupos';
    protected $fillable = ['nombre', 'usuario_id'];

    public function usuario()
    {
    	return $this->belongsTo(\App\Models\Usuario::class, 'usuario_id', 'id');
    }

    public function miembros()
    {
    	return $this->belongsToMany(\App\Models\Usuario::class, 'chat_grupos_usuarios', 'chat_grupo_id', 'usuario_id')
    		->withPivot(['activo'])
    		->withTimestamps();
    }

    public function mensajes()
    {
    	return $this->hasMany(\App\Models\ChatGrupoMensaje::class, 'chat_grupo_id', 'id');
    }

    public function scopeGetMensajesSinLeer($model, $user_id = null)
    {
        $chat_grupos = Usuario::find($user_id)->chat_grupos;
        $ultimos_activos = Usuario::find($user_id)
            ->chat_grupos()
            ->get()
            ->pluck('pivot.activo', 'id');
        $contador = 0;

        $chat_grupos->each(function ($chat_grupo) use ($user_id, $ultimos_activos, &$contador) {
            $contador += $chat_grupo
                ->mensajes()
                ->where('created_at', '>=', $ultimos_activos[$chat_grupo->id])
                ->where('usuario_id', '<>', $user_id)
                ->get()
                ->count();
        });

        return ['cantidad' => $contador];
    }

    public function scopeMensajesNoLeidos($model, $chat_grupo_id, $user_id)
    {
        $chat_grupo = $this->find($chat_grupo_id);
        $ultimo_activo = $chat_grupo->miembros()->find($user_id)->pivot->activo;
        $contador = 0;

        if ($ultimo_activo) {
            $contador = $chat_grupo->mensajes()
                ->where('created_at', '>=', $ultimo_activo)
                ->where('usuario_id', '<>', $user_id)
                ->count();
        }

        return ['cantidad' => $contador];
    }
}
