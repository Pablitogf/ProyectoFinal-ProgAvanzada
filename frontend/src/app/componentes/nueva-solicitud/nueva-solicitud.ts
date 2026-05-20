import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SolicitudesService } from '../../servicios/solicitudes';
import { AuthService } from '../../servicios/auth';

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
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    tipo: ['', Validators.required],
    descripcionBreve: ['', [Validators.required, Validators.minLength(10)]],  // ← 20 igual que el backend
    prioridad: ['MEDIA', Validators.required]
  });

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
        usuarioId: this.authService.getUserId()  // ← toma el id real del JWT
      };

      this.solicitudesService.crear(payload).subscribe({
        next: () => {
          alert('¡Solicitud creada exitosamente!');
          this.router.navigate(['/lista-solicitudes']);
        },
        error: (err) => {
          console.error('Error:', err);
          alert(`Error ${err.status}: ${err.error?.message ?? 'Revisa la consola.'}`);
        }
      });
    }
  }
}
