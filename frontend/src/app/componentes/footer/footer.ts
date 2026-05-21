import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  encapsulation: ViewEncapsulation.None // Permite romper el fondo blanco nativo
})
export class Footer { // 👈 Cambiado de 'FooterComponent' a 'Footer' para que encaje con tu app.ts
  // Lógica limpia
}
