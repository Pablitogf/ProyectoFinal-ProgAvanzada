import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SolicitudResumen } from '../modelos/solicitudes';

interface SpringPage<T> {
  content: T[];
}

interface SolicitudApiDetalle {
  id: string;
  codigo: string;
  descripcion: string;
  estado: string;
  canalOrigen: string;
  solicitante: string;
  responsable: string | null;
  fechaCreacion: string | number[];
}

@Injectable({
  providedIn: 'root',
})
export class SolicitudesService {
  private readonly http = inject(HttpClient);

  // 🟢 CORREGIDO: Apunta explícitamente al puerto 8080 de tu Spring Boot
  private readonly apiUrl = 'http://localhost:8080/api/solicitudes';

  /** Lista solicitudes no cerradas */
  listar(): Observable<SolicitudResumen[]> {
    return this.http
      .get<SpringPage<SolicitudApiDetalle>>(`${this.apiUrl}/consultas/paginadas`, {
        params: { pagina: '0', tamano: '100' },
      })
      .pipe(map((page) => (page.content ?? []).map(adaptarResumen)));
  }

  /** Enbía la nueva solicitud al backend */
  crear(solicitud: any): Observable<any> {
    return this.http.post(this.apiUrl, solicitud);
  }
}

// --- Funciones auxiliares (se mantienen exactamente igual) ---

function adaptarResumen(s: SolicitudApiDetalle): SolicitudResumen {
  const fecha = normalizarFecha(s.fechaCreacion);
  const desc = s.descripcion ?? '';
  return {
    id: s.id,
    codigo: s.codigo,
    estado: s.estado,
    tipo: s.canalOrigen ?? '—',
    fechaCreacion: fecha,
    nombrePropietario: s.solicitante ?? '',
    descripcionBreve: desc.length > 120 ? desc.slice(0, 117) + '…' : desc,
  };
}

function normalizarFecha(v: string | number[] | undefined): string {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (Array.isArray(v) && v.length >= 3) {
    const [y, m, d] = v;
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T00:00:00`;
  }
  return String(v);
}
