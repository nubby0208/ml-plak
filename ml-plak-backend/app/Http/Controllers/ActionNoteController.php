<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\ActionNotes;

use JWTAuth;

class ActionNoteController extends Controller
{
  public function allOrig($token)
	{
		return response()->json(['success' => true,'actionnotes' => ActionNotes::where('token_project', $token)->orderBy('id', 'asc')->get()]);
	}

  public function index($proyecto_id)
	{
		return response()->json(['success' => true,'actionnotes' => ActionNotes::where('proyecto_id', $proyecto_id)->orderBy('id', 'asc')->get()]);
	}

  public function store(Request $request)
	{
		// ADD Validator
		//$user_id = JWTAuth::parseToken()->authenticate()->id;

    $actionnote = new ActionNotes;
		$actionnote->fill($request->all());

		if (!$actionnote->save()) {
			return response()->json(['success' => false]);
		}

		return response()->json(['success' => true, 'actionnote' => $actionnote]);
	}

	public function update($id, Request $request)
	{
		// ADD Validator
		//$user_id = JWTAuth::parseToken()->authenticate()->id;

		$actionnote = ActionNotes::where('id', $id)
			                       ->firstOrFail();

		$actionnote->update($request->all());

		return response()->json(['success' => true,'actionnote' => $actionnote]);
	}

  public function delete($id)
	{
		$actionnote = ActionNotes::findOrFail((int) $id);

		if ($actionnote->delete())
			return response()->json(['success' => true]);

		return response()->json(['error' => true]);
	}
}
