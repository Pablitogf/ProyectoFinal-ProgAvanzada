import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'; // Requerido para signals
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

// Componentes directos de PrimeNG v21 (¡Sin módulos obsoletos!)
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { IftaLabel } from 'primeng/iftalabel';
import { Fluid } from 'primeng/fluid';
import { Card } from 'primeng/card';

import { AuthService } from '../../servicios/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    InputText,
    Password,
    Button,
    Message,
    IftaLabel,
    Fluid,
    Card
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);

  // Inicialización directa del formulario reactivo
  readonly loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // Signals de estado para la interfaz de usuario
  readonly isLoading = signal(false);
  readonly result = signal('');

  // toSignal() convierte los cambios de estado del formulario en un Signal reactivo
  private readonly formStatus = toSignal(
    this.loginForm.statusChanges,
    { initialValue: 'INVALID' as const }
  );

  // computed(): El botón se habilita automáticamente solo si el formulario es válido y no está cargando
  readonly canSubmit = computed(() => this.formStatus() === 'VALID' && !this.isLoading());

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.result.set('');
    const { username, password } = this.loginForm.getRawValue();

    this.authService.login({ username, password })
      .pipe(takeUntilDestroyed(this.destroyRef)) // Previene memory leaks al destruir el componente
      .subscribe({
        next: (response: any) => {
          this.isLoading.set(false);

          // Sincronización con el estado de autenticación global del servicio
          if (this.authService.isAuthenticated) {
            this.authService.isAuthenticated.set(true);
          }

          // Si tu servicio aún usa persistSession, lo dejamos aquí de respaldo:
          if (typeof this.authService.persistSession === 'function') {
            this.authService.persistSession(response);
          }

          // Redirección al listado de solicitudes como exige la guía
          void this.router.navigate(['/lista-solicitudes']);
        },
        error: (err: Error) => {
          this.isLoading.set(false);
          this.result.set(err.message || 'Credenciales incorrectas o error de red.');
        },
      });
  }
}
