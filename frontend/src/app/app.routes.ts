import { Routes } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio';
import { ListaSolicitudes } from './componentes/lista-solicitudes/lista-solicitudes';
import { LoginComponent } from './componentes/login/login'; // Nombre corregido
import { NuevaSolicitud } from './componentes/nueva-solicitud/nueva-solicitud';
import { RegistroComponent } from './componentes/registro/registro';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent }, // Nombre corregido
  { path: 'registro', component: RegistroComponent },
  { path: 'nueva-solicitud', component: NuevaSolicitud },
  { path: 'lista-solicitudes', component: ListaSolicitudes },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];
