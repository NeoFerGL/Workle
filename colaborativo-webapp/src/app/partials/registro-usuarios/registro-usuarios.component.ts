import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-registro-usuarios',
  templateUrl: './registro-usuarios.component.html',
  styleUrls: ['./registro-usuarios.component.scss']
})
export class RegistroUsuariosComponent implements OnInit{
  
  //Variables del componente registro
  public usuario: any = {};
  public editar: boolean = false;

  public token: string = "";
  public idUser: Number = 0;

  // creo los jason
  public errors: any = {};
  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  // password porque es el input del ojo
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  constructor(
    private location: Location,
    private usuariosService: UsuarioService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.usuario = this.usuariosService.esquemaUsuario();
    console.log("Usuario", this.usuario)
  }

  public regresar() {
    this.location.back();
  }

  public registrar() {
    this.errors = [];
    this.errors = this.usuariosService.validarUsuario(this.usuario, this.editar);

    if (!$.isEmptyObject(this.errors)) {
      return false;
    }

    if (this.usuario.password === this.usuario.confirmar_password) {
      // Construimos solo los campos esperados por la interfaz del servicio
      const payload = {
        first_name: this.usuario.first_name,
        last_name: this.usuario.last_name,
        email: this.usuario.email,
        password: this.usuario.password
      };

      this.usuariosService.registrarUser(payload).subscribe(
        (response) => {
          alert("Usuario registrado correctamente");
          console.log("Usuario registrado: ", response);
          this.router.navigate(["/"]);
        },
        (error) => {
          console.error("Error al registrar:", error.error);
          alert("No se pudo registrar usuario");
        }
      );

    } else {
      alert("Las contraseñas no coinciden");
      this.usuario.password = "";
      this.usuario.confirmar_password = "";
    }
  }
  
  public actualizar(){

  }

  //Funciones para password
  showPassword() {
    if (this.inputType_1 == 'password') {
      this.inputType_1 = 'text';
      this.hide_1 = true;
    }
    else {
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  showPwdConfirmar() {
    if (this.inputType_2 == 'password') {
      this.inputType_2 = 'text';
      this.hide_2 = true;
    }
    else {
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }
}
