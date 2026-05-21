import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Páginas públicas: se pueden pre-renderizar en el servidor
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'login',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'registro',
    renderMode: RenderMode.Prerender
  },
  // Rutas protegidas: SOLO en el cliente, necesitan localStorage/token
  {
    path: 'lista-solicitudes',
    renderMode: RenderMode.Client
  },
  {
    path: 'nueva-solicitud',
    renderMode: RenderMode.Client
  },
  // Cualquier otra ruta: también solo cliente por seguridad
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
