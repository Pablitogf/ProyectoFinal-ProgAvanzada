import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private readonly http = inject(HttpClient);

  // 🔴 URL centralizada apuntando directo al puerto 8080 de tu Backend Java
  private readonly API_URL = 'http://localhost:8080/api/auth';


  registrar(datos: any): Observable<string> {
    return this.http.post(`${this.API_URL}/registrar`, datos, {
      responseType: 'text'
    });
  }
}
