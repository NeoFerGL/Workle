import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient) { }

  // Subir archivo al servidor
  uploadFile(data: FormData): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', `${environment.url_api}/upload/`, data, {
      reportProgress: true,  // Progreso de la carga
      responseType: 'json'
    });
    return this.http.request(req);
  }

  // Obtener lista de archivos
  getFiles(): Observable<any> {
    return this.http.get<any>(`${environment.url_api}/files/`);
  }

  // Obtener lista de imágenes
  getImages(): Observable<any> {
    return this.http.get<any>(`${environment.url_api}/images/`);
  }

  // Método para eliminar un archivo
  deleteFile(fileId: number): Observable<any> {
    return this.http.post(`${environment.url_api}/delete-file/${fileId}/`, {});
  }
}
