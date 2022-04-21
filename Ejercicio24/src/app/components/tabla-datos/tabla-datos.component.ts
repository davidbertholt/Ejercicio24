import { Component, Input, OnInit } from '@angular/core';

import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";

import * as reparadorActions from "../../store/actions/reparador.action";
import * as colaClienteActions from "../../store/actions/cliente.action";
import { encolarCliente } from 'src/app/store/actions/app.action';

import { obtenerExponencial, obtenerTiempoEntreLlegada, obtenerUniforme } from 'src/app/utils/funciones_datos';

import { ICliente } from 'src/app/Interfaces/ICliente';

import { CLIENTE_PENDIENTE, CLIENTE_SIENDO_ATENDIDO } from 'src/app/utils/estados';

import { INFERIOR_LLEGADA, INFERIOR_PRECIO, MAX_NUMBER, MEDIA_EXPONENCIAL, SUPERIOR_LLEGADA, SUPERIOR_PRECIO } from 'src/app/utils/contantes';

import { LLEGADA_CLIENTE } from 'src/app/utils/eventos';

@Component({
  selector: 'app-tabla-datos',
  templateUrl: './tabla-datos.component.html',
  styleUrls: ['./tabla-datos.component.css']
})
export class TablaDatosComponent implements OnInit {

  @Input() relojMaximo!: number;

  historialEventos: any[] = [];

  timpoProximaLLegada = MAX_NUMBER;
  finReparador1 = MAX_NUMBER;
  finReparador2 = MAX_NUMBER;
  finReparador3 = MAX_NUMBER;

  storeSumulacion$!: Observable <any>;
  colaClientes$!: Observable <any>;

  reloj: number = 0;

  constructor(
    private store: Store<{simulacionState: any}>,
  ) {}

  ngOnInit(): void {

    this.storeSumulacion$ = this.store.pipe(select("simulacionState"));

    // AGREGA EL INICIAL
    this.agregarEstadoAHistorial();
    this.obtenerRelojEstadoInicial();
    this.generarProximaLlegada();
    this.iniciarSimulacion();
  }

  agregarEstadoAHistorial() {
    this.storeSumulacion$.subscribe(imgStore => {
      this.historialEventos.push(imgStore);
    })

    console.log(this.historialEventos);
    
  }

  obtenerRelojEstadoInicial () {
    this.storeSumulacion$.subscribe(storeInicial => {
      this.reloj = storeInicial.llegadas.tiempoProximaLlegada;
      this.timpoProximaLLegada = storeInicial.llegadas.tiempoProximaLlegada;
    });
    console.log("inicio " + this.reloj );
    
  }

  iniciarSimulacion() {
    console.log(this.relojMaximo);
    
    console.log(

      this.reloj < this.relojMaximo
    );
    while (this.reloj < this.relojMaximo) {
      const proxEvento = Math.min(this.timpoProximaLLegada, this.finReparador1, this.finReparador2, this.finReparador3);

      switch (proxEvento) {
        case this.timpoProximaLLegada:
          this.generarProximaLlegada()
          break;
        case this.finReparador1:
          this.generarProximoFinAtencion()
          break;
        case this.finReparador2:
          this.generarProximoFinAtencion()
          break;
        case this.finReparador3:
          this.generarProximoFinAtencion()
          break;
      }
    }
  }

  generarProximoFinAtencion() {
    console.log('fin at');
    this.finReparador1 = 1
    this.reloj++;
  }

  generarProximaLlegada () {
    const ultimaPosicionHistorial = this.historialEventos.length - 1;
    let colaClientes = this.historialEventos[ultimaPosicionHistorial]?.colaClientes;

    const nuevoOrden =  colaClientes.length + 1 ?? 1;

    const nuevoCliente: ICliente = {
      estado: CLIENTE_PENDIENTE,
      orden: nuevoOrden,
    };

    const colaActualizada = colaClientes.length? colaClientes.push(nuevoCliente) : [nuevoCliente];

    const tiempoEntreLlegadas = obtenerTiempoEntreLlegada();
    const tiempoProximaLlegada = this.reloj + tiempoEntreLlegadas;
    const timepo = this.reloj

    this.store.dispatch(encolarCliente({timepo, colaActualizada, tiempoEntreLlegadas, tiempoProximaLlegada}));

    this.agregarEstadoAHistorial();
    this.timpoProximaLLegada = tiempoProximaLlegada;
  }

  generarProximaAtencion() {
    const nuevoTiempoAtencion = obtenerExponencial(MEDIA_EXPONENCIAL);
    const precioNuevaAtencion = obtenerUniforme(INFERIOR_PRECIO, SUPERIOR_PRECIO)

    // TODO: Revisar para pasarle el cliente por parametro
    const nuevoCliente: ICliente = {
      orden: 1,
      estado: CLIENTE_SIENDO_ATENDIDO

    }

    const tiempoFinAtencionDU = obtenerUniforme(INFERIOR_LLEGADA, SUPERIOR_LLEGADA)
    const precioDU = obtenerUniforme(INFERIOR_PRECIO, SUPERIOR_PRECIO)
    const relojActual = this.reloj;
    const idReparador = 1;
    this.store.dispatch(reparadorActions.atenderProximoCliente({relojActual, tiempoFinAtencionDU, precioDU, nuevoCliente, idReparador}))
  }

  public llegadaNuevoCliente () {
    const ultimoOrden = 0;
    this.store.dispatch(colaClienteActions.encolarCliente({ultimoOrden}))
  }
}
