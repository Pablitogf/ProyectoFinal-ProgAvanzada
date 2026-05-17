import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private readonly http = inject(HttpClient);
  // Esta ruta debe coincidir con el SecurityController de Java
  // Así debe quedar en src/app/servicios/usuarios.ts
  private readonly url = '/api/auth/registrar';

  registrar(usuario: any) {
    return this.http.post(this.url, usuario);
  }
}
