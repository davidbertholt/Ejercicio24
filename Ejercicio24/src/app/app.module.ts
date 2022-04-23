import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TablaDatosComponent } from './components/tabla-datos/tabla-datos.component';
import { FormularioDatosComponent } from './components/formulario-datos/formulario-datos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// Reducer
import { appReducer } from './store/reducers/app.reducer';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TablaDatosComponent,
    FormularioDatosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({
      simulacionState: appReducer,
    }),
    StoreDevtoolsModule.instrument()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
