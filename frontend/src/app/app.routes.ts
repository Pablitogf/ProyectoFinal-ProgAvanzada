// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio';
import { LoginComponent } from './componentes/login/login';
import { RegistroComponent } from './componentes/registro/registro';
import { NuevaSolicitud } from './componentes/nueva-solicitud/nueva-solicitud';
import { ListaSolicitudes } from './componentes/lista-solicitudes/lista-solicitudes';
import { authGuard } from './guards/auth-guard';
import { publicGuard } from './guards/public-guard';

export const routes: Routes = [
  { path: '', component: InicioComponent },

  // Rutas públicas — si ya está autenticado, redirige a /lista-solicitudes
  { path: 'login', component: LoginComponent, canActivate: [publicGuard] },
  { path: 'registro', component: RegistroComponent, canActivate: [publicGuard] },

  // Rutas privadas — requieren autenticación
  { path: 'lista-solicitudes', component: ListaSolicitudes, canActivate: [authGuard] },
  { path: 'nueva-solicitud', component: NuevaSolicitud, canActivate: [authGuard] },

  { path: '**', pathMatch: 'full', redirectTo: '' },
];
