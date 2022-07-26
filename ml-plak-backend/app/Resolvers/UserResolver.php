<?php
namespace App\Resolvers;

use JWTAuth;

class UserResolver implements \OwenIt\Auditing\Contracts\UserResolver
{
	/**
	 * {@inheritdoc}
	 */
	public static function resolve()
	{
		try {
			return JWTAuth::parseToken()->authenticate()->id;
		} catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
			return null;
		}
		// return Sentinel::check() ? Sentinel::getUser()->getUserId() : null;
	}
}
