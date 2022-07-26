import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private router: Router, private authService: AuthService, private toastr: ToastrService) {}

	canActivate() {
		// console.log('guard');
		if (!this.authService.isTokenExpired())
			return true;

		window.localStorage.removeItem('usuario');
		window.localStorage.removeItem('jwt-token');
		this.toastr.error('¡No se ha logueado!');
		this.router.navigate(['/login']);
		return false;

	}
}
