import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FacadeService } from './facade.service';

// Configuracion de cabercera para la api
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

// Interfaz para el payload de registro de usuario
export interface UserRegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService,
  ) { }

  public esquemaUsuario() {
    return {
      'first_name': '',
      'last_name': '',
      'email': '',
      'password': '',
      'confirmar_password': ''
    }
  }
  //Validación para el formulario
  public validarUsuario(data: any, editar: boolean) {
    console.log("Validando usuario... ", data);
    let error: any = [];

    if (!this.validatorService.required(data["first_name"])) {
      error["first_name"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["last_name"])) {
      error["last_name"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["email"])) {
      error["email"] = this.errorService.required;
    } else if (!this.validatorService.max(data["email"], 40)) {
      error["email"] = this.errorService.max(40);
    } else if (!this.validatorService.email(data['email'])) {
      error['email'] = this.errorService.email;
    }

    if (!editar) {
      if (!this.validatorService.required(data["password"])) {
        error["password"] = this.errorService.required;
      }

      if (!this.validatorService.required(data["confirmar_password"])) {
        error["confirmar_password"] = this.errorService.required;
      }
    }
    
    //Return arreglo
    return error;
  }
  /*Aquí van los servicios HTTP
    Servicio para registrar un nuevo usuario
    El /users esta en la ruta urls.py de la api
    para pasar como peticion post
  */
  public registrarUser(data: UserRegisterPayload): Observable<any> {
    return this.http.post<any>(`${environment.url_api}/users/`, data, httpOptions);
  }

  public obtenerListaUsusarios(): Observable<any> {
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    return this.http.get<any>(`${environment.url_api}/lista-usuarios/`, { headers: headers });
  }
}

