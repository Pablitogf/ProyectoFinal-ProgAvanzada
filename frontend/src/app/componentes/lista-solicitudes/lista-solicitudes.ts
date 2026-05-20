import { isPlatformBrowser, SlicePipe } from '@angular/common';
import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap, catchError, of } from 'rxjs';

import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ProgressSpinner } from 'primeng/progressspinner';

import { SolicitudResumen } from '../../modelos/solicitudes';
import { SolicitudesService } from '../../servicios/solicitudes';
import { NotificationService } from '../../servicios/notification';
import { PageResponse } from '../../dto/page-response';

const EMPTY_PAGE: PageResponse<SolicitudResumen> = {
  content: [], totalElements: 0, totalPages: 0, size: 5, number: 0
};

@Component({
  selector: 'app-lista-solicitudes',
  standalone: true,
  imports: [RouterLink, SlicePipe, Card, Tag, Button, TableModule, PaginatorModule, ProgressSpinner],
  templateUrl: './lista-solicitudes.html',
  styleUrl: './lista-solicitudes.css',
})
export class ListaSolicitudes {
  private readonly solicitudesService = inject(SolicitudesService);
  private readonly notificationService = inject(NotificationService);
  private readonly platformId = inject(PLATFORM_ID);

  page = signal(0);
  size = signal(5);

  private params = computed(() => ({ page: this.page(), size: this.size() }));

  paginatedData = toSignal(
    toObservable(this.params).pipe(
      switchMap(p =>
        isPlatformBrowser(this.platformId)
          ? this.solicitudesService.listarPaginado(p.page, p.size).pipe(
            catchError(() => {
              this.notificationService.error('Error', 'No se pudo cargar el listado.');
              return of(EMPTY_PAGE);
            })
          )
          : of(EMPTY_PAGE)
      )
    ),
    { initialValue: EMPTY_PAGE }
  );

  solicitudes = computed(() => this.paginatedData().content);
  totalElements = computed(() => this.paginatedData().totalElements);
  cargando = computed(() =>
    this.solicitudes().length === 0 && this.totalElements() === 0
  );

  onPageChange(event: PaginatorState): void {
    this.page.set(event.page ?? 0);
    this.size.set(event.rows ?? 5);
  }

  tagSeveridadEstado(estado: string): 'secondary' | 'info' | 'success' | 'warn' | 'contrast' {
    const mapa: Record<string, 'secondary' | 'info' | 'success' | 'warn' | 'contrast'> = {
      CREADA: 'secondary', CLASIFICADA: 'info', ASIGNADA: 'info',
      EN_ATENCION: 'warn', ATENDIDA: 'success', CERRADA: 'contrast',
    };
    return mapa[estado] ?? 'secondary';
  }

  tagSeveridadPrioridad(prioridad: string | undefined): 'success' | 'warn' | 'danger' | 'secondary' {
    if (!prioridad) return 'secondary';
    const mapa: Record<string, 'success' | 'warn' | 'danger' | 'secondary'> = {
      BAJA: 'success', MEDIA: 'warn', ALTA: 'danger',
    };
    return mapa[prioridad] ?? 'secondary';
  }
}
