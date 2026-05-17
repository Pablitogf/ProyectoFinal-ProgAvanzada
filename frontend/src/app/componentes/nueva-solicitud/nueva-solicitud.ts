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

  form = this.fb.group({
    tipo: ['', Validators.required],
    descripcionBreve: ['', [Validators.required, Validators.minLength(10)]],
    prioridad: ['MEDIA', Validators.required]
  });

  enviar() {
    if (this.form.valid) {
      this.solicitudesService.crear(this.form.value as any).subscribe({
        next: () => {
          alert('¡Creado!');
          this.router.navigate(['/lista-solicitudes']);
        },
        error: (err) => console.error(err)
      });
    }
  }
}
