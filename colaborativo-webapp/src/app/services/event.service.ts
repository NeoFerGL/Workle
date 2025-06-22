import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  // Obtener todos los eventos
  public getEvents(): Observable<any> {
    return this.http.get<any>(`${environment.url_api}/events/`, httpOptions);
  }

  // Añadir un nuevo evento
  public addEvent(data: any): Observable<any> {
    return this.http.post<any>(`${environment.url_api}/events/`, data, httpOptions);
  }

  // Actualizar un evento existente por ID
  public updateEvent(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${environment.url_api}/events/${id}/`, data, httpOptions);
  }

  // Eliminar un evento por ID
  public deleteEvent(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.url_api}/events/${id}/`, httpOptions);
  }
}
