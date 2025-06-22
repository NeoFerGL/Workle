import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-usuarios-screen',
  templateUrl: './usuarios-screen.component.html',
  styleUrls: ['./usuarios-screen.component.scss']
})
export class UsuariosScreenComponent implements OnInit {
  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  // peticion al servicio
  public lista_usuarios: any[] = [];

  //Para la tabla depende el usuario el displayed
  displayedColumns: string[] = ['first_name', 'last_name', 'email', 'editar', 'eliminar'];

  dataSource = new MatTableDataSource<DatosUsuario>(this.lista_usuarios as DatosUsuario[]);

  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    private usuariosService: UsuarioService,
    private facadeService: FacadeService,
    private router: Router,

  ){}

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    //Validar que haya inicio de sesión
    //Obtengo el token del login
    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token);

    if (this.token == "") {
      this.router.navigate([""]);
    }

    this.obtenerUsuarios();
    //Para paginador
    this.initPaginator();
  }

  //Obtener alumnos
  public obtenerUsuarios() {
    this.usuariosService.obtenerListaUsusarios().subscribe(
      (response) => {
        this.lista_usuarios = response;
        console.log("Lista users: ", this.lista_usuarios);
        if (this.lista_usuarios.length > 0) {
          //Agregar datos del nombre e email
          this.lista_usuarios.forEach(usuario => {
            usuario.first_name = usuario.user.first_name;
            usuario.last_name = usuario.user.last_name;
            usuario.email = usuario.user.email;
          });
          console.log("Otro user: ", this.lista_usuarios);

          this.dataSource = new MatTableDataSource<DatosUsuario>(this.lista_usuarios as DatosUsuario[]);
        }
      }, (error) => {
        alert("No se pudo obtener la lista de usuarios");
      }
    );
  }

  //Para paginación
  public initPaginator() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      //console.log("Paginator: ", this.dataSourceIngresos.paginator);
      //Modificar etiquetas del paginador a español
      this.paginator._intl.itemsPerPageLabel = 'Registros por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `0 / ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
      };
      this.paginator._intl.firstPageLabel = 'Primera página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Página siguiente';
    }, 500);
    //this.dataSourceIngresos.paginator = this.paginator;
  }

  public goEditar(idUser: number){

  }

  public delete(idUser: number){

  }


}//Cierra la clase

//Esto va fuera de la llave que cierra la clase
export interface DatosUsuario {
  id: number,
  first_name: string;
  last_name: string;
  email: string;
}
