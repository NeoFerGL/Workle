import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';

declare var $:any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  // Decorador input (entrada)
  @Input() tipo: string = "";
  @Input() rol: string = "";

  public token: string = "";
  public editar: boolean = false;
  constructor(
    private router: Router,
    private facadeService: FacadeService,
    public activatedRoute: ActivatedRoute,
  ){}

  ngOnInit(): void {
    this.rol = this.facadeService.getUserGroup();
    console.log("Rol user: ", this.rol);
    //Validar que haya inicio de sesión
    //Obtengo el token del login
    this.token = this.facadeService.getSessionToken();
    //El primer if valida si existe un parámetro en la URL
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
    }
  }

  //Cerrar sesión
  public logout() {
    this.facadeService.logout().subscribe(
      (response) => {
        console.log("Entró");
        this.facadeService.destroyUser();
        //Navega al login
        this.router.navigate(["/"]);
      }, (error) => {
        console.error(error);
      }
    );
  }

  public clickNavLink(link: string) {
    this.router.navigate([link]);
    setTimeout(() => {
      this.activarLink(link);
    }, 100);
  }

  public activarLink(link: string) {
    // Elimina todas las clases activas primero
    $("#principal").removeClass("active");
    $("#usuarios").removeClass("active");

    // Agrega la clase activa según el enlace
    if (link === "home") {
      $("#principal").addClass("active");
    } else if (link === "usuarios") {
      $("#usuarios").addClass("active");
    }
  }
}
