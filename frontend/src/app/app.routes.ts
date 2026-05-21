// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard'; // 🛡️ Dejado tal cual tu original
import { publicGuard } from './guards/public-guard'; // 🛡️ Dejado tal cual tu original

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./componentes/inicio/inicio').then(m => m.InicioComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./componentes/login/login').then(m => m.LoginComponent),
    canActivate: [publicGuard]
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./componentes/registro/registro').then(m => m.RegistroComponent),
    canActivate: [publicGuard]
  },
  {
    path: 'lista-solicitudes',
    loadComponent: () =>
      import('./componentes/lista-solicitudes/lista-solicitudes')
        .then(m => m.ListaSolicitudes), // 💎 CORREGIDO: Tenía un error tipográfico ('ListaSolicitudes')
    canActivate: [authGuard]
  },
  {
    path: 'nueva-solicitud',
    loadComponent: () =>
      import('./componentes/nueva-solicitud/nueva-solicitud')
        .then(m => m.NuevaSolicitud), // 💎 Mantenido tu nombre de clase original
    canActivate: [authGuard]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];
