// src/app/interceptores/auth-interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../servicios/auth';
import { NotificationService } from '../servicios/notification';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  if (!authService.isAuthenticated()) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${authService.getToken()}` }
  });

  return next(authReq).pipe(
    catchError(error => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
        notificationService.warn('Sesión expirada', 'Por favor inicie sesión nuevamente.');
      } else if (error.status === 403) {
        notificationService.error('Acceso denegado', 'No tiene permisos para esta acción.');
      } else if (error.status === 0) {
        notificationService.error('Sin conexión', 'No se pudo conectar con el servidor.');
      }
      return throwError(() => error);
    })
  );
};
