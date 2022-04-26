import { Component, Input, OnInit } from '@angular/core';

import { ICliente } from 'src/app/Interfaces/ICliente';

import { GestorEventosService } from 'src/app/services/gestor-eventos.service';

@Component({
  selector: 'app-tabla-datos',
  templateUrl: './tabla-datos.component.html',
  styleUrls: ['./tabla-datos.component.css']
})
export class TablaDatosComponent implements OnInit {

  @Input() relojMaximo!: number;

  colaClientes: ICliente[] = []
  historialEventos: any[] = [];

  reparador1 = '1';
  reparador2 = '2';
  reparador3 = '3';

  precioFinal = 0;
  costoFinal = 0;

  tableHeader = ['Reloj', 'Evento', 'Cliente', 'Largo Cola', 'T entre llegadas', 'T prox llegada', 'R1 Estado', 'R1 Cliente', 'R1 T ente atencion','R1 T prox atencion','R1 precio','R1 costo','R2 Estado','R2 Cliente','R2 T ente atencion','R2 T prox atencion','R2 precio','R2 costo','R3 Estado','R3 Cliente','R3 T ente atencion','R3 T prox atencion','R3 precio','R3 costo']

  constructor(
    private gestorSimulacion: GestorEventosService
  ) {}

  ngOnInit(): void {
    this.gestorSimulacion.gestorSimulacion$.subscribe(data => {
      if (data === 'reset') {
        this.resetear()
      } else {
        this.historialEventos.push(data);
      }
    });
    this.gestorSimulacion.gastosEmitir$.subscribe(data => this.costoFinal = data)
    this.gestorSimulacion.preciosEmitir$.subscribe(data => this.precioFinal = data)
  }

  resetear() {
    this.historialEventos = [];
  }

}
