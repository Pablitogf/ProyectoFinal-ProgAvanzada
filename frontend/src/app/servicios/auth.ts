import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest, TokenResponse } from '../modelos/login-api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);


  private readonly API_URL = 'http://localhost:8080/api/auth';

  /** Fuente única de verdad para sesión (Guía 16). */
  readonly isAuthenticated = signal(this.readTokenFromStorage());


  login(request: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.API_URL}/login`, request);
  }


  registrar(request: any): Observable<string> {
    return this.http.post('http://localhost:8080/api/auth/registrar', request, {
      responseType: 'text'
    });
  }

  persistSession(response: TokenResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('roles', JSON.stringify(response.roles ?? []));
    this.isAuthenticated.set(true);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    this.isAuthenticated.set(false);
  }

  private readTokenFromStorage(): boolean {
    try {
      return !!localStorage.getItem('token');
    } catch {
      return false;
    }
  }
}
