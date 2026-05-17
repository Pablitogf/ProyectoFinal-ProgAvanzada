import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

// Componentes directos de PrimeNG v21 (¡Cero módulos obsoletos!)
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { IftaLabel } from 'primeng/iftalabel';
import { Fluid } from 'primeng/fluid';
import { MessageService } from 'primeng/api';

import { UsuariosService } from '../../servicios/usuarios';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    Card,
    InputText,
    Password,
    Button,
    Toast,
    IftaLabel,
    Fluid
  ],
  providers: [MessageService], // Proveedor local para activar los Toasts visuales
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {
  private readonly fb = inject(FormBuilder);
  private readonly usuariosService = inject(UsuariosService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  form = this.fb.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  registrar() {
    if (this.form.invalid) return;

    this.usuariosService.registrar(this.form.value).subscribe({
      next: () => {
        // Notificación de éxito espectacular en la esquina superior derecha
        this.messageService.add({
          severity: 'success',
          summary: '¡Acceso Concedido!',
          detail: 'Protocolo de registro completado con éxito.',
          life: 3000
        });

        // Espera 1.5 segundos para que el usuario vea el efecto visual antes de redirigir
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        console.error('Detalle del error en Consola:', err);

        // Notificación de error premium en lugar de un alert plano del navegador
        this.messageService.add({
          severity: 'error',
          summary: 'Fallo de Sincronización',
          detail: 'No se pudo establecer conexión con el servidor central (8080).',
          life: 4000
        });
      }
    });
  }
}
