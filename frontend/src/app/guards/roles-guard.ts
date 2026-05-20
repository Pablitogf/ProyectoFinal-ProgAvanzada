// src/app/guards/roles-guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../servicios/auth';

export const rolesGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const expectedRoles: string[] = route.data['expectedRoles'] || [];
  if (expectedRoles.length === 0) return true;

  const userRoles = authService.getRoles();
  const hasRole = expectedRoles.some(role => userRoles.includes(role));

  return hasRole ? true : router.createUrlTree(['/unauthorized']);
};
