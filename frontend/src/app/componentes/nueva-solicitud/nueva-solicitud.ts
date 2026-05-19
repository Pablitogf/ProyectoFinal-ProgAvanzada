import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SolicitudesService } from '../../servicios/solicitudes';

@Component({
  selector: 'app-nueva-solicitud',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './nueva-solicitud.html',
  styleUrl: './nueva-solicitud.css',
})
export class NuevaSolicitud {
  private fb = inject(FormBuilder);
  private solicitudesService = inject(SolicitudesService);
  private router = inject(Router);

  // Mantenemos tu formulario exactamente igual a tu HTML
  form = this.fb.group({
    tipo: ['', Validators.required],
    descripcionBreve: ['', [Validators.required, Validators.minLength(10)]],
    prioridad: ['MEDIA', Validators.required]
  });

  enviar() {
    if (this.form.valid) {
      const valores = this.form.value;

      // 🔄 MAPEO AL DTO DE JAVA (CrearSolicitudRequest)
      // Convertimos el String de tu select al ID numérico que exige el catálogo de Java
      let idCatalogo = 1; // Por defecto SOPORTE (Id: 1)
      if (valores.tipo === 'MANTENIMIENTO') idCatalogo = 2;
      if (valores.tipo === 'SOFTWARE') idCatalogo = 3;

      const payload = {
        tipoSolicitudId: idCatalogo,             // Java: request.tipoSolicitudId()
        descripcion: valores.descripcionBreve,    // Java: request.descripcion()
        usuarioId: 1                              // Java: request.usuarioId() -> Quemamos id 1 temporalmente para pruebas
      };

      // Enviamos el payload corregido al servidor
      this.solicitudesService.crear(payload).subscribe({
        next: () => {
          alert('¡Solicitud creada exitosamente!');
          this.router.navigate(['/lista-solicitudes']);
        },
        error: (err) => {
          console.error('Detalles del error 400:', err);
          alert('Error al guardar la solicitud. Revisa la consola.');
        }
      });
    }
  }
}
