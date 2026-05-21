import { Component, ViewEncapsulation } from '@angular/core'; // 👈 Importamos ViewEncapsulation

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  encapsulation: ViewEncapsulation.None // 👈 ¡AGREGA ESTA LÍNEA AQUÍ!
})
export class Dashboard {}
