import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FacadeService } from './facade.service';

@Injectable({
  providedIn: 'root'
})
export class VideollamadasService {

  private apiUrl = 'http://localhost:8000/api/generar-id-reunion/';

  constructor(
    private http: HttpClient,
    private facadeService: FacadeService  // Usamos el FacadeService para obtener el token
  ) { }

  generarEnlaceReunion(): Observable<{ roomId: string }> {
    const authToken = this.facadeService.getSessionToken();  // Obtenemos el token desde el FacadeService
    const headers = new HttpHeaders({
      'Authorization': `Token ${authToken}`  // Agregamos el token a los headers
    });

    return this.http.post<{ roomId: string }>(this.apiUrl, {}, { headers });
  }
}
