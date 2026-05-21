import { Component, OnInit, ViewEncapsulation, inject, PLATFORM_ID, ChangeDetectorRef, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);

  todasLasSolicitudes: SolicitudResumen[] = [];
  solicitudesPagina: SolicitudResumen[] = [];
  cargando = true;
  error = '';

  paginaActual = 0;
  tamano = 5;

  get totalElementos(): number { return this.todasLasSolicitudes.length; }
  get totalPaginas(): number { return Math.ceil(this.totalElementos / this.tamano); }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Usamos NgZone.run para garantizar que la respuesta HTTP
      // siempre dispare la detección de cambios de Angular,
      // sin importar desde qué contexto llegue la respuesta.
      this.ngZone.run(() => this.cargarSolicitudes());
    }
  }

  cargarSolicitudes(): void {
    this.cargando = true;
    this.error = '';

    const usuarioId = this.authService.getUserId();

    if (!usuarioId) {
      // Si por algún motivo no hay token todavía, reintentamos una vez
      // después de que el browser termine de hidratar
      setTimeout(() => {
        const id = this.authService.getUserId();
        if (id) {
          this.cargarSolicitudes();
        } else {
          this.error = 'No se pudo obtener el usuario. Por favor recargue.';
          this.cargando = false;
          this.cdr.detectChanges();
        }
      }, 100);
      return;
    }

    this.solicitudesService.listarPorUsuario(usuarioId).subscribe({
      next: (lista) => {
        this.todasLasSolicitudes = lista;
        this.aplicarPagina();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando solicitudes:', err);
        this.error = 'No se pudieron cargar las solicitudes.';
        this.cargando = false;
        this.cdr.detectChanges();
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
