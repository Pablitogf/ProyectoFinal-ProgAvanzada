import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SolicitudesService } from '../../servicios/solicitudes';
import { AuthService } from '../../servicios/auth';
import { SolicitudResumen } from '../../modelos/solicitudes';

@Component({
  selector: 'app-lista-solicitudes',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './lista-solicitudes.html',
  styleUrl: './lista-solicitudes.css',
  encapsulation: ViewEncapsulation.None
})
export class ListaSolicitudes implements OnInit {
  private solicitudesService = inject(SolicitudesService);
  private authService = inject(AuthService);
  private router = inject(Router);

  todasLasSolicitudes: SolicitudResumen[] = [];
  solicitudesPagina: SolicitudResumen[] = [];
  cargando = true;
  error = '';

  paginaActual = 0;
  tamano = 5;

  get totalElementos(): number { return this.todasLasSolicitudes.length; }
  get totalPaginas(): number { return Math.ceil(this.totalElementos / this.tamano); }

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.cargando = true;
    this.error = '';
    const usuarioId = this.authService.getUserId();

    this.solicitudesService.listarPorUsuario(usuarioId).subscribe({
      next: (lista) => {
        this.todasLasSolicitudes = lista;
        this.aplicarPagina();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando solicitudes:', err);
        this.error = 'No se pudieron cargar las solicitudes.';
        this.cargando = false;
      }
    });
  }

  aplicarPagina(): void {
    const inicio = this.paginaActual * this.tamano;
    this.solicitudesPagina = this.todasLasSolicitudes.slice(inicio, inicio + this.tamano);
  }

  cambiarTamano(event: Event): void {
    this.tamano = Number((event.target as HTMLSelectElement).value);
    this.paginaActual = 0;
    this.aplicarPagina();
  }

  irAPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPaginas) {
      this.paginaActual = pagina;
      this.aplicarPagina();
    }
  }

  paginasArray(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i);
  }

  nuevaSolicitud(): void {
    this.router.navigate(['/nueva-solicitud']);
  }
}
