/** Módulos de enrutado de Angular2 */
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './auth.guard';
// import { AdminImagesComponent } from './image-gallery/admin-images/admin-images.component';
// Array con las rutas de este módulo. Ninguna funcional.
const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '/login' },
  { path: 'inicio', redirectTo: '' },
  { path: '**', redirectTo: '', pathMatch: 'full', canActivate: [AuthGuard] }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes) // configuración para el módulo raíz
  ],
  exports: [
    RouterModule // se importará desde el módulo padre
  ]
})
export class AppRoutingModule { }
