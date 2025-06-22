import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import { RegistroScreenComponent } from './screens/registro-screen/registro-screen.component';
import { HomeScreenComponent } from './screens/home-screen/home-screen.component';
import { UsuariosScreenComponent } from './screens/usuarios-screen/usuarios-screen.component';
import { VideollamadasScreenComponent } from './screens/videollamadas-screen/videollamadas-screen.component';
import { CalendariosScreenComponent } from './screens/calendarios-screen/calendarios-screen.component';
import { ArchivosScreenComponent } from './screens/archivos-screen/archivos-screen.component';
import { PizarraScreenComponent } from './screens/pizarra-screen/pizarra-screen.component';

const routes: Routes = [
  { path: '', component: LoginScreenComponent, pathMatch: 'full' },
  { path: 'registro-usuarios', component: RegistroScreenComponent, pathMatch: 'full' },
  { path: 'home', component: HomeScreenComponent, pathMatch: 'full' },
  { path: 'usuario', component: UsuariosScreenComponent, pathMatch: 'full' },
  // Rutas para los nuevos componentes
  { path: 'videollamadas', component: VideollamadasScreenComponent, pathMatch: 'full' },
  { path: 'calendarios', component: CalendariosScreenComponent, pathMatch: 'full' },
  { path: 'archivos', component: ArchivosScreenComponent, pathMatch: 'full' },
  { path: 'pizarra', component: PizarraScreenComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
