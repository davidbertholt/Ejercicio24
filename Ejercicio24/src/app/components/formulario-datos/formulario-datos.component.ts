import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-formulario-datos',
  templateUrl: './formulario-datos.component.html',
  styleUrls: ['./formulario-datos.component.css']
})

export class FormularioDatosComponent implements OnInit {

  @Output() horasSimulacionEmit = new EventEmitter<number>();

  cantidadReparadoresControl!: FormControl;
  cantidadHorasSimulacionControl!: FormControl;

  deshabilitarBoton: boolean = false;

  horasSimulacion = 100;

  constructor() {
    this.cantidadHorasSimulacionControl = new FormControl(this.horasSimulacion,[
      Validators.required,
      Validators.min(1)
    ]);
   }

  ngOnInit(): void {
  }

  start = () => {
    this.deshabilitarBoton = !this.deshabilitarBoton;
    this.horasSimulacionEmit.emit(this.horasSimulacion);
    console.log(this.horasSimulacion);
    
  }

  stop = () => {
    this.deshabilitarBoton = !this.deshabilitarBoton
  }

}
