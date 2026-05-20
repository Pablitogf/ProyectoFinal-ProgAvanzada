// src/app/interceptores/auth-interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../servicios/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si no está autenticado, pasa la petición sin token (ej: login, registro)
  if (!authService.isAuthenticated()) {
    return next(req);
  }

  // Clona la petición añadiendo el header Authorization
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authService.getToken()}`
    }
  });

  return next(authReq).pipe(
    catchError(error => {
      // Token expirado o inválido → cerrar sesión y redirigir
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
