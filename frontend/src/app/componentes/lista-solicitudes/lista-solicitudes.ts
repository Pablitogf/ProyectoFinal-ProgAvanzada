import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-solicitudes',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './lista-solicitudes.html',
  styleUrl: './lista-solicitudes.css',
  encapsulation: ViewEncapsulation.None // 🌟 Clave para forzar los brillos sobre el layout
})
export class ListaSolicitudes {
  // Lógica de datos de tu grilla
}
