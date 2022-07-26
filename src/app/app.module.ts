import { ReportesListComponent } from './reportes/list.component';
import { GrupoFormComponent } from './grupos/form.component';
import { GrupoService } from './services/grupo.service';
import { TablePropertiesService } from './services/table-properties.service';
import { GoogleApiEventService } from './google-api-event.service';
import { GoogleApiService } from './google-api.service';
import { UsuarioService } from './services/usuario.service';
import { HorarioService } from './services/horario.service';
import { FeriadoService } from './services/feriado.service';
import { AsistenciaService } from './services/asistencia.service';
import { AuditoriaService } from './services/auditoria.service';
import { ClienteService } from './services/cliente.service';
import { ProyectoService } from './services/proyecto.service';
import { EstadoService } from './services/estado.service';
import { PiezaService } from './services/pieza.service';
import { TapacantoService } from './services/tapacanto.service';
import { MaterialService } from './services/material.service';
import { ModuloService } from './services/modulo.service';
import { AuthService } from './services/auth.service';
import { PuntajeService } from './services/puntaje.service';
import { OptimizarService } from './services/optimizar.service';
import { AdminImagesService } from './services/admin-images.service';
import { MensajeService } from './services/mensaje.service';
import { RespaldoService } from './services/respaldo.service';
import { sockets } from './services/sockets.service';
import { ImagenTareaUploadService } from './services/imagen-tarea-upload.service';

import { AuthGuard } from './auth.guard'
import { AuthErrorHandler } from './error-handler';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, ErrorHandler, LOCALE_ID } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders, HttpResponse, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthRequestOptions, Interceptor } from './auth-request';

import { AppComponent } from './app.component';
import { TallerComponent } from './taller/taller.component';
import { ImageGalleryComponent } from './image-gallery/image-gallery.component';
import { TablaMaterialComponent } from './tabla-material/tabla-material.component';
import { ModalAlertComponent } from './modal-alert/modal-alert.component';
import { ModalSelectComponent } from './modal-select/modal-select.component';
import { VerModButtonComponent } from './ver-mod-button/ver-mod-button.component';
import { ModalOptimizeComponent } from './modal-optimize/modal-optimize.component';
import { UserSelectorComponent } from './user-selector/user-selector.component';
import { TablaPartsPanelsComponent } from './tabla-parts-panels/tabla-parts-panels.component';
import { CalendarComponents } from './calendar/calendar.component';
import { TareaComponents } from './tarea/tarea.component';
import { InstalacionComponent } from './instalacion/instalacion.component';
import { ComprasypedidosComponent } from './comprasypedidos/comprasypedidos.component';
import { MensajesComponent } from './mensajes/mensajes.component';
import { AsistenciaComponent } from './asistencia/asistencia.component';
import { UsuarioListComponent } from './usuario/list.component';
import { UsuarioFormComponent } from './usuario/form.component';
import { HorarioListComponent } from './horario/list.component';
import { HorarioFormComponent } from './horario/form.component';
import { MaterialListComponent } from './material/list.component';
import { MaterialFormComponent } from './material/form.component';
import { HorarioDefaultFormComponent } from './horario/formDefault.component';
import { FeriadoComponent } from './horario/feriado.component';
import { AsistenciaListComponent } from './asistencia/list.component';
import { AuditoriaListComponent } from './auditoria/list.component';
import { SeguridadCheckComponent } from './seguridad/check.component';
import { LoginComponent } from './login/login.component';
import { MiProduccionComponent } from './miproduccion/miproduccion.component';
import { EditInfoComponent } from './taller/edit_info.component';
import { ProyectoListComponent } from './proyecto/list.component';
import { ProyectoFormComponent } from './proyecto/form.component';
import { RespaldoListComponent } from './respaldo/list.component';
import { ProduccionAdminComponent } from './produccion-admin/produccion-admin.component';

import { Daterangepicker } from 'ng2-daterangepicker';
import { ToastrModule } from 'ngx-toastr';
import { SweetAlert2Module } from '@toverux/ngsweetalert2';
import { NgxPermissionsModule, NgxPermissionsGuard } from 'ngx-permissions';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { AdminImagesComponent } from './image-gallery/admin-images/admin-images.component';
import { A2Edatetimepicker } from 'ng2-eonasdan-datetimepicker';
import { AdminPiezasComponent } from './proyecto/admin-piezas/admin-piezas.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { registerLocaleData } from '@angular/common';

import { GrupoListComponent } from './grupos/list.component';
import { CalendarHeaderComponent } from './calendar/utils/calendar-header.component';
import localeEsAr from '@angular/common/locales/es-AR';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TareaService } from './services/tarea.service';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxUiLoaderModule, NgxUiLoaderConfig } from 'ngx-ui-loader';
import { EncuestaTipoService } from './services/encuesta_tipo.service';
import { EncuestaRespuestaService } from './services/encuesta_respuesta.service';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { TareasRealizadas, ImagePreview } from './utils';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';

import { AgmCoreModule } from '@agm/core';
import { FileUploadModule } from 'ng2-file-upload';
import { LightboxModule } from 'ngx-lightbox';
import { PresupuestosComponent } from './presupuestos/presupuestos.component';
import { PresupuestoService } from './services/presupuesto.service';
import { CapacidadProduccionComponent } from './capacidad-produccion/capacidad-produccion.component';
import { TiempoTrasladosComponent } from './tiempo-traslados/tiempo-traslados.component';
import { MaquinasComponent } from './maquinas/maquinas.component';
import { MaquinaService } from './services/maquina.service';

registerLocaleData(localeEsAr);

declare var $: any;

export const optionsMask: Partial<IConfig> | (() => Partial<IConfig>) = null;

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  "bgsColor": "#ffffff",
  "bgsOpacity": 0.5,
  "bgsPosition": "bottom-right",
  "bgsSize": 60,
  "bgsType": "ball-spin-clockwise",
  "blur": 4,
  "fgsColor": "#ffffff",
  "fgsPosition": "center-center",
  "fgsSize": 60,
  "fgsType": "ball-scale-multiple",
  "gap": 30,
  "logoPosition": "center-center",
  "logoSize": 120,
  "logoUrl": "",
  "masterLoaderId": "master",
  "overlayBorderRadius": "0",
  "overlayColor": "rgba(40, 40, 40, 0.8)",
  "pbColor": "#ffffff",
  "pbDirection": "ltr",
  "pbThickness": 3,
  "hasProgressBar": true,
  "text": "Cargando datos",
  "textColor": "#FFFFFF",
  "textPosition": "center-center",
}

const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/taller' },
  { path: 'taller', component: TallerComponent, canActivate: [AuthGuard] },
  { path: 'partes', component: TablaPartsPanelsComponent, canActivate: [AuthGuard] },
  { path: 'Calendario', component: CalendarComponents, canActivate: [AuthGuard] },
  { path: 'tareas', component: TareaComponents, canActivate: [AuthGuard] },
  { path: 'miproduccion', component: MiProduccionComponent, canActivate: [AuthGuard] },
  { path: 'Instalacion', component: InstalacionComponent, canActivate: [AuthGuard] },
  { path: 'compras-y-pedidos', component: ComprasypedidosComponent, canActivate: [AuthGuard] },
  { path: 'Mensajes', component: MensajesComponent, canActivate: [AuthGuard] },
  { path: 'presupuestos', component: PresupuestosComponent, canActivate: [AuthGuard] },
  { path: 'asistencia', component: AsistenciaComponent, canActivate: [AuthGuard] },
  {
    path: 'images/admin',
    component: AdminImagesComponent,
    canActivate: [AuthGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'Administrador'
      }
    }
  },
  {
    path: 'admin/usuario',
    component: UsuarioListComponent,
    canActivate: [AuthGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'Administrador'
      }
    }
  },
  {
    path: 'admin/grupos',
    component: GrupoListComponent,
    canActivate: [AuthGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'Administrador'
      }
    }
  },
  {
    path: 'admin/horario',
    component: HorarioListComponent,
    canActivate: [AuthGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'Administrador'
      }
    }
  },
  {
    path: 'admin/material',
    component: MaterialListComponent,
    canActivate: [AuthGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'Administrador'
      }
    }
  },
  {
    path: 'admin/asistencia',
    component: AsistenciaListComponent,
    canActivate: [AuthGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'Administrador'
      }
    }
  },
  {
    path: 'admin/auditoria',
    component: AuditoriaListComponent,
    canActivate: [AuthGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'Administrador'
      }
    }
  },
  {
    path: 'admin/proyecto',
    component: ProyectoListComponent,
    canActivate: [AuthGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'Administrador'
      }
    }
  },
  {
    path: 'admin/capacidadproduccion',
    component: CapacidadProduccionComponent,
    canActivate: [AuthGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'Administrador'
      }
    }
  },
  {
    path: 'admin/maquinas',
    component: MaquinasComponent,
    canActivate: [AuthGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'Administrador'
      }
    }
  },  
  {
    path: 'admin/tiempotraslados',
    component: TiempoTrasladosComponent,
    canActivate: [AuthGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'Administrador'
      }
    }
  },
  {
    path: 'admin/respaldo',
    component: RespaldoListComponent,
    canActivate: [AuthGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'Administrador'
      }
    }
  },
  {
    path: 'admin/reportes',
    component: ReportesListComponent,
    canActivate: [AuthGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'Administrador'
      }
    }
  },
  {
    path: 'admin/produccion',
    component: ProduccionAdminComponent,
    canActivate: [AuthGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'Administrador'
      }
    }
  },
  { path: 'login', component: LoginComponent }
]

export function tokenGetter() {
  return localStorage.getItem("jwt-token");
}


@NgModule({
  declarations: [
    AppComponent,
    TallerComponent,
    ImageGalleryComponent,
    TablaMaterialComponent,
    ModalAlertComponent,
    ModalSelectComponent,
    VerModButtonComponent,
    ModalOptimizeComponent,
    UserSelectorComponent,
    TablaPartsPanelsComponent,
    CalendarComponents,
    TareaComponents,
    InstalacionComponent,
    ComprasypedidosComponent,
    MensajesComponent,
    AsistenciaComponent,
    UsuarioListComponent,
    UsuarioFormComponent,
    GrupoListComponent,
    GrupoFormComponent,
    HorarioListComponent,
    HorarioFormComponent,
    FeriadoComponent,
    HorarioDefaultFormComponent,
    MaterialListComponent,
    MaquinasComponent,
    MaterialFormComponent,
    AsistenciaListComponent,
    AuditoriaListComponent,
    CapacidadProduccionComponent,
    TiempoTrasladosComponent,
    SeguridadCheckComponent,
    LoginComponent,
    PdfViewerComponent,
    AdminImagesComponent,
    MiProduccionComponent,
    EditInfoComponent,
    ProyectoListComponent,
    ProyectoFormComponent,
    AdminPiezasComponent,
    RespaldoListComponent,
    ProduccionAdminComponent,
    CalendarHeaderComponent,
    ReportesListComponent,
    TareasRealizadas,
    PresupuestosComponent,
    ImagePreview
  ],
  imports: [
    BrowserModule,
    PdfViewerModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, {
      useHash: true
    }),
    Daterangepicker,
    ToastrModule.forRoot(),
    SweetAlert2Module.forRoot({
      // buttonsStyling:     false,
      customClass: 'unfont-size',
      // confirmButtonClass: 'btn btn-primary',
      // cancelButtonClass:  'btn btn-danger'
    }),
    // JwtModule.forRoot({config: {}}),
    NgxPermissionsModule.forRoot(),
    A2Edatetimepicker,
    HttpClientModule,
    JwtModule.forRoot({ config: { tokenGetter } }),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    NgbModule,
    NgSelectModule,
    NgxMaskModule.forRoot(optionsMask),
    NgxDatatableModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'info' // set defaults here
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDWPO4BYBh5HieRmN_radXJcNBZQL3tv_Q',
      libraries: ['places']
    }),
    FileUploadModule,
    LightboxModule
  ],
  providers: [
    GoogleApiService,
    GoogleApiEventService,
    TablePropertiesService,
    UsuarioService,
    HorarioService,
    FeriadoService,
    AsistenciaService,
    AuditoriaService,
    ClienteService,
    ProyectoService,
    EstadoService,
    PiezaService,
    TapacantoService,
    MaterialService,
    ModuloService,
    AuthService,
    PuntajeService,
    OptimizarService,
    AdminImagesService,
    MaquinaService,
    MensajeService,
    RespaldoService,
    sockets,
    AuthGuard,
    GrupoService,
    EncuestaRespuestaService,
    PresupuestoService,
    TareaService,
    EncuestaTipoService,
    AuthRequestOptions,
    {
      provide: ErrorHandler,
      useClass: AuthErrorHandler
    },
    JwtHelperService,
    ImagenTareaUploadService,
    { provide: LOCALE_ID, useValue: 'es-AR' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
