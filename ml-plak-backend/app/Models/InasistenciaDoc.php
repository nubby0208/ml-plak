<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class InasistenciaDoc extends Model
{
	protected $table    = 'inasistencia_docs';
	protected $fillable = ['inasistencia_id', 'descripcion', 'doc'];
	public $timestamps  = true;

	protected $appends = ['doc_url'];

	public function getDocUrlAttribute() {
		$filePath = public_path() . '/storage/docs/inasistencia/' . $this->doc;
		if (File::exists($filePath)) {
			return url('/storage/docs/inasistencia') . "/" . $this->doc;
		}  
		$filePath = public_path() . '/storage/images/inasistencia/' . $this->doc;
		if (File::exists($filePath)) {
			return url('/storage/images/inasistencia') . "/" . $this->doc;
		}
		return null;
    }
}
