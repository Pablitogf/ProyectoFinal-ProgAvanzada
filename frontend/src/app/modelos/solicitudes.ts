/** Resumen adaptado para la vista de listado (Guía 16). */
export interface SolicitudResumen {
  id: string;
  codigo: string;
  estado: string;
  tipo: string;
  fechaCreacion: string;
  prioridad?: string;
  nombrePropietario: string;
  descripcionBreve?: string;
}
