import { isPlatformBrowser, SlicePipe } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { of } from 'rxjs';

// Componentes standalone directos exigidos por la Guía 17
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';

import { SolicitudResumen } from '../../modelos/solicitudes';
import { SolicitudesService } from '../../servicios/solicitudes';

@Component({
  selector: 'app-lista-solicitudes',
  standalone: true,
  imports: [RouterLink, SlicePipe, Card, Tag, Button],
  templateUrl: './lista-solicitudes.html',
  styleUrl: './lista-solicitudes.css',
})
export class ListaSolicitudes {
  private readonly solicitudesService = inject(SolicitudesService);
  private readonly platformId = inject(PLATFORM_ID);

  // Mantenemos el toSignal() y la validación de plataforma original
  readonly solicitudes = toSignal(
    isPlatformBrowser(this.platformId)
      ? this.solicitudesService.listar()
      : of([] as SolicitudResumen[]),
    {
      initialValue: [] as SolicitudResumen[],
    },
  );

  /**
   * Mapea el estado a severidades estrictas tipadas de PrimeNG v21
   */
  tagSeveridadEstado(estado: string): 'secondary' | 'info' | 'success' | 'warn' | 'contrast' {
    const mapa: Record<string, 'secondary' | 'info' | 'success' | 'warn' | 'contrast'> = {
      CREADA: 'secondary',
      CLASIFICADA: 'info',
      ASIGNADA: 'info',
      EN_ATENCION: 'warn',
      ATENDIDA: 'success',
      CERRADA: 'contrast',
    };
    return mapa[estado] ?? 'secondary';
  }

  /**
   * Mapea la prioridad a las severidades nativas de PrimeNG v21
   * Corregido: Se usa 'danger' en lugar de 'error' para pintar en rojo brillante
   */
  tagSeveridadPrioridad(prioridad: string | undefined): 'success' | 'warn' | 'danger' | 'secondary' {
    if (!prioridad) return 'secondary';

    const mapa: Record<string, 'success' | 'warn' | 'danger' | 'secondary'> = {
      BAJA: 'success',
      MEDIA: 'warn',
      ALTA: 'danger',
    };
    return mapa[prioridad] ?? 'secondary';
  }
}
