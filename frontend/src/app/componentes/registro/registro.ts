import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Componentes directos de PrimeNG v21
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { IftaLabel } from 'primeng/iftalabel';
import { Fluid } from 'primeng/fluid';
import { MessageService } from 'primeng/api';

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
  providers: [MessageService],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly http = inject(HttpClient);

  form = this.fb.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  registrar() {
    if (this.form.invalid) return;

    const { nombre, correo, password } = this.form.getRawValue();


    const payload = {
      id: correo, // Tu entidad JPA maneja String ID no autoincremental, usamos el correo como llave única
      nombre: nombre,
      email: correo,
      password: password,
      rolUser: 'OPERADOR' // Envió de rol requerido por la restricción de tu base de datos
    };

    this.http.post('http://localhost:8080/api/auth/registrar', payload, {
      responseType: 'text'
    }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: '¡Acceso Concedido!',
          detail: 'Protocolo de registro completado con éxito.',
          life: 3000
        });

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        console.error('Detalle del error en Consola:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Fallo de Sincronización',
          detail: 'No se pudo completar el registro en el servidor central.',
          life: 4000
        });
      }
    });
  }
}
