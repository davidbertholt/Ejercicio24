import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TablaDatosComponent } from './components/tabla-datos/tabla-datos.component';
import { FormularioDatosComponent } from './components/formulario-datos/formulario-datos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MinutosAHorasPipe } from './pipes/minutos-ahoras.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TablaDatosComponent,
    FormularioDatosComponent,
    MinutosAHorasPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
