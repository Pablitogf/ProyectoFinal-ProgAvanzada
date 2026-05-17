import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private readonly http = inject(HttpClient);
  // URL de tu API en Spring Boot corriendo en el puerto 8080
  private readonly API = 'http://localhost:8080/api/auth';

  /**
   * Envía los datos de registro al Backend
   * @param datosUsuario Objeto con nombre, correo y password
   */
  registrar(datosUsuario: any): Observable<any> {
    // Si tu backend espera un endpoint como /registro o /register, cámbialo aquí:
    return this.http.post<any>(`${this.API}/registro`, datosUsuario);
  }
}
