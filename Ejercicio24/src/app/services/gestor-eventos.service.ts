import { Injectable } from '@angular/core';

// Observables
import { Observable, Subject } from 'rxjs';
import { IEstadoActual } from '../Interfaces/IEstado';
import { I3Reparadores } from '../Interfaces/IReparador';

// constantes
import { MAX_NUMBER } from '../utils/contantes';
import { inicialAppState } from '../utils/estados';

// funciones
import { horasAMiutos, obtenerTiempoEntreLlegada } from '../utils/funciones_datos';

// estado predefinido
import { REPARADOR_LIBRE } from '../utils/nombreDeEstados';
import { GestsorAtencionService } from './gestsor-atencion.service';
import { GestsorLlegadasService } from './gestsor-llegadas.service';

@Injectable({
  providedIn: 'root'
})
export class GestorEventosService {

  private gestorSimulacion: Subject<any>;
  public gestorSimulacion$: Observable<any>;

  precioTotal = 0;
  private precioEmitir: Subject<number>;
  public preciosEmitir$: Observable<number>;

  gastoTotal = 0;
  private gastosEmitir: Subject<number>;
  public gastosEmitir$: Observable<number>;

  // keys de proximo tiempo
  tiempoProximaLLegada = MAX_NUMBER;
  finReparador1 = MAX_NUMBER + 1;
  finReparador2 = MAX_NUMBER + 2;
  finReparador3 = MAX_NUMBER + 3;

  colaEventos: IEstadoActual[] = [];
  // estadoActual!: IEstadoActual;

  reparadorEnEspera!: string | undefined;

  constructor(
    private gestsorLlegadasService: GestsorLlegadasService,
    private gestsorAtencionService: GestsorAtencionService
    ) {
    this.gestorSimulacion = new Subject<any>();
    this.gestorSimulacion$ = this.gestorSimulacion.asObservable();
    this.precioEmitir = new Subject<number>();
    this.preciosEmitir$ = this.precioEmitir.asObservable();
    this.gastosEmitir = new Subject<number>();
    this.gastosEmitir$ = this.gastosEmitir.asObservable();
    this.setearInicial();
  }

  setearReparadorEnEspera(reparadorId: string) {
    this.reparadorEnEspera = reparadorId;
  }

  setearInicial () {
    this.tiempoProximaLLegada = MAX_NUMBER;
    this.finReparador1 = MAX_NUMBER + 1;
    this.finReparador2 = MAX_NUMBER + 2;
    this.finReparador3 = MAX_NUMBER + 3;
    this.precioTotal = 0;
    this.gastoTotal = 0;
  }

  restart() {
    this.setearInicial();
    this.gestorSimulacion.next("reset");
  }

  start(horas: number) {
    this.setearInicial();
    const minutos = horasAMiutos(horas)
    const estadoInicial = this.generarEstadoInicial()
    this.iniciarSimulacion(minutos, estadoInicial)

    this.precioEmitir.next(this.precioTotal);
    this.gastosEmitir.next(this.gastoTotal);
    this.gestorSimulacion.next(this.colaEventos);

  }

  hayReparadorLibre(estadoActual: IEstadoActual) {
    const keys = Object.keys(estadoActual.reparadores);
    return keys.find((key) =>
      estadoActual.reparadores[Number(key)].estado === REPARADOR_LIBRE);
  }

  generarEstadoInicial (): IEstadoActual {
    const llegadaInicial = obtenerTiempoEntreLlegada();

    const llegadasNuevas = {
      tiempoEntreLlegadas: llegadaInicial,
      tiempoProximaLlegada: llegadaInicial
    }

    const nuevoEstado = {
      ...inicialAppState,
      llegadas: llegadasNuevas,
    };

    // this.gestorSimulacion.next(nuevoEstado);
    this.colaEventos.push(nuevoEstado);
    return {...nuevoEstado}
  }

  iniciarSimulacion (tiempo: number, nuevoEstado: IEstadoActual) {
    this.tiempoProximaLLegada = nuevoEstado.llegadas.tiempoProximaLlegada;

    let proxEvento = nuevoEstado.llegadas.tiempoProximaLlegada;

    while (proxEvento < tiempo) {
      this.reparadorEnEspera = this.hayReparadorLibre(nuevoEstado);

      let colaPrevia = 0;
      nuevoEstado.reloj= proxEvento;

      switch (proxEvento) {

        case this.tiempoProximaLLegada:
          nuevoEstado = {
            ...this.gestsorLlegadasService.generarNuevaLLegada(nuevoEstado, this.reparadorEnEspera),
          }

          if (this.reparadorEnEspera) {
            this.actualizarPrecioGastos(nuevoEstado.reparadores[Number(this.reparadorEnEspera)].precio, nuevoEstado.reparadores[Number(this.reparadorEnEspera)].gastos);
          }

          this.actualizarFinReparacion(nuevoEstado.reparadores, Number(this.reparadorEnEspera));

          this.tiempoProximaLLegada = nuevoEstado.llegadas.tiempoProximaLlegada;
          break;

        case this.finReparador1:
          colaPrevia = nuevoEstado.largoCola;
          const index1 = 1;
          nuevoEstado = {
            ...this.gestsorAtencionService.finalizarAtencionCliente(nuevoEstado, index1),
          }
          // Si tengo un fin de atencion, pero en medio la cola cambio, quiere edcir que atendi a alguien
          if(colaPrevia !== nuevoEstado.largoCola) {
            this.actualizarPrecioGastos(nuevoEstado.reparadores[index1].precio, nuevoEstado.reparadores[index1].gastos)
          }
          this.actualizarFinReparacion(nuevoEstado.reparadores, index1);
          break;

        case this.finReparador2:
          colaPrevia = nuevoEstado.largoCola;
          const index2 = 2;
          nuevoEstado = {
            ...this.gestsorAtencionService.finalizarAtencionCliente(nuevoEstado, index2),
          }
          // Si tengo un fin de atencion, pero en medio la cola cambio, quiere edcir que atendi a alguien
          if(colaPrevia !== nuevoEstado.largoCola) {
            this.actualizarPrecioGastos(nuevoEstado.reparadores[index2].precio, nuevoEstado.reparadores[index2].gastos)
          }
          this.actualizarFinReparacion(nuevoEstado.reparadores, index2);
          break;

        case this.finReparador3:
          colaPrevia = nuevoEstado.largoCola;
          const index3 = 3;
          nuevoEstado = {
            ...this.gestsorAtencionService.finalizarAtencionCliente(nuevoEstado, index3),
          }

          // Si tengo un fin de atencion, pero en medio la cola cambio, quiere edcir que atendi a alguien
          if(colaPrevia !== nuevoEstado.largoCola) {
            this.actualizarPrecioGastos(nuevoEstado.reparadores[index3].precio, nuevoEstado.reparadores[index3].gastos)
          }
          this.actualizarFinReparacion(nuevoEstado.reparadores, index3);
          break;
      }

      this.colaEventos.push(nuevoEstado);

      // this.gestorSimulacion.next(nuevoEstado);

      // estadoActual = {...nuevoEstado}

      proxEvento = Math.min(this.tiempoProximaLLegada, this.finReparador1, this.finReparador2, this.finReparador3);

    }
  }

  actualizarFinReparacion(reparadores: I3Reparadores, reparador: number) {
    switch(reparador) {
      case 1:
        this.finReparador1 = this.getTiempoReparador(reparadores, reparador);
        break;
      case 2:
        this.finReparador2 = this.getTiempoReparador(reparadores, reparador);
        break;
      case 3:
        this.finReparador3 = this.getTiempoReparador(reparadores, reparador);
        break;
    }
  }

  getTiempoReparador(reparadores: I3Reparadores, reparador: number) {
    return reparadores[reparador].tiempoProximaAtencion === 0?
        MAX_NUMBER :
        reparadores[reparador].tiempoProximaAtencion;
  }

  actualizarPrecioGastos (precioNuevo: number, gastosNuevos: number): void {
    this.gastoTotal += gastosNuevos;
    this.precioTotal += precioNuevo;

  }
}
