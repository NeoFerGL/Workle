import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { NgChartsModule } from 'ng2-charts';

//Este import es para los servicios HTTP
import { HttpClientModule } from '@angular/common/http';

//Angular material
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
// import { HomeScreenComponent } from './screens/home-screen/home-screen.component';
// import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import { RegistroScreenComponent } from './screens/registro-screen/registro-screen.component';
import { NavbarComponent } from './partials/navbar/navbar.component';
import { RegistroUsuariosComponent } from './partials/registro-usuarios/registro-usuarios.component';
import { HomeScreenComponent } from './screens/home-screen/home-screen.component';
import { UsuariosScreenComponent } from './screens/usuarios-screen/usuarios-screen.component';
//  Nuevos componentes para la funcionalidad de mi aplicacion
import { VideollamadasScreenComponent } from './screens/videollamadas-screen/videollamadas-screen.component';
import { ArchivosScreenComponent } from './screens/archivos-screen/archivos-screen.component';
import { PizarraScreenComponent } from './screens/pizarra-screen/pizarra-screen.component';
import { CalendariosScreenComponent } from './screens/calendarios-screen/calendarios-screen.component';

// Componentes de fullcalendar
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // Para arrastrar y soltar



@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [
    AppComponent,
    LoginScreenComponent,
    RegistroScreenComponent,
    NavbarComponent,
    RegistroUsuariosComponent,
    HomeScreenComponent,
    UsuariosScreenComponent,
    VideollamadasScreenComponent,
    ArchivosScreenComponent,
    PizarraScreenComponent,
    CalendariosScreenComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatRadioModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    HttpClientModule,
    FullCalendarModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }