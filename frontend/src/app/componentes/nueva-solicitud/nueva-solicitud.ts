import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SolicitudesService } from '../../servicios/solicitudes';
import { AuthService } from '../../servicios/auth';
import { NotificationService } from '../../servicios/notification';
import { CommonModule } from '@angular/common'; // Agregado para usar clases dinámicas de Angular

@Component({
  selector: 'app-nueva-solicitud',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './nueva-solicitud.html',
  styleUrl: './nueva-solicitud.css',
})
export class NuevaSolicitud {
  private fb = inject(FormBuilder);
  private solicitudesService = inject(SolicitudesService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  form = this.fb.group({
    tipo: ['', Validators.required],
    descripcionBreve: ['', [Validators.required, Validators.minLength(10)]],
    prioridad: ['MEDIA', Validators.required]
  });

  // Métodito mágico para actualizar la prioridad de los botones cyber de forma reactiva
  cambiarPrioridad(nivel: 'BAJA' | 'MEDIA' | 'ALTA') {
    this.form.get('prioridad')?.setValue(nivel);
  }

  enviar() {
    if (this.form.valid) {
      const valores = this.form.value;

      const tipoMap: Record<string, number> = {
        'SOPORTE': 1,
        'MANTENIMIENTO': 2,
        'SOFTWARE': 3,
      };

      const payload = {
        tipoSolicitudId: tipoMap[valores.tipo ?? ''] ?? 1,
        descripcion: valores.descripcionBreve ?? '',
        canalOrigen: 'WEB',
        usuarioId: this.authService.getUserId()
      };

      this.solicitudesService.crear(payload).subscribe({
        next: () => {
          this.notificationService.success('¡Éxito!', 'La solicitud fue registrada correctamente.');
          this.router.navigate(['/lista-solicitudes']);
        },
        error: (err) => {
          console.error('Error:', err);
          this.notificationService.error('Error', `No se pudo crear la solicitud (${err.status}).`);
        }
      });
    }
  }
}
