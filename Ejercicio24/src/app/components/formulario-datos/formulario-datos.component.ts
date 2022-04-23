import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { RelojService } from 'src/app/services/reloj.service';

@Component({
  selector: 'app-formulario-datos',
  templateUrl: './formulario-datos.component.html',
})

export class FormularioDatosComponent {

  cantidadReparadoresControl!: FormControl;
  cantidadHorasSimulacionControl!: FormControl;

  deshabilitarBoton: boolean = false;

  horasSimulacion = 1;

  constructor(
    private relojService: RelojService
  ) {
    this.cantidadHorasSimulacionControl = new FormControl(this.horasSimulacion,[
      Validators.required,
      Validators.min(1)
    ]);
   }

  start = () => {
    this.deshabilitarBoton = !this.deshabilitarBoton;
    this.relojService.startReloj(this.horasSimulacion);
  }

  restart = () => {
    this.relojService.restart();
    this.deshabilitarBoton = !this.deshabilitarBoton
  }
}
