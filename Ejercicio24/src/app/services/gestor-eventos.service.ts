import { Injectable } from '@angular/core';

// Observables
import { Subject } from 'rxjs';
import { ICliente } from '../Interfaces/ICliente';
import { IEstadoActual } from '../Interfaces/IEstado';
import { IReparador } from '../Interfaces/IReparador';

// constantes
import { MAX_NUMBER } from '../utils/contantes';
import { inicialAppState } from '../utils/estados';
import { LLEGADA_CLIENTE } from '../utils/eventos';

// funciones
import { horasAMiutos, obtenerPrecioAtencion, obtenerTiempoAtencion, obtenerTiempoEntreLlegada } from '../utils/funciones_datos';

// estado predefinido
import { CLIENTE_FINALIZADO, CLIENTE_PENDIENTE, CLIENTE_SIENDO_ATENDIDO, REPARADOR_LIBRE, REPARADOR_OCUPADO } from '../utils/nombreDeEstados';

@Injectable({
  providedIn: 'root'
})
export class GestorEventosService {

  private gestorSimulacion = new Subject<any>();
  public gestorSimulacion$ = this.gestorSimulacion.asObservable();

  precioTotal = 0;
  private precioEmitir = new Subject<number>();
  public preciosEmitir$ = this.precioEmitir.asObservable();

  gastoTotal = 0;
  private gastosEmitir = new Subject<number>();
  public gastosEmitir$ = this.gastosEmitir.asObservable();

  // keys de proximo tiempo
  tiempoProximaLLegada = MAX_NUMBER;
  finReparador1 = MAX_NUMBER + 1;
  finReparador2 = MAX_NUMBER + 2;
  finReparador3 = MAX_NUMBER + 3;

  tiempoProximoEvento = 0;

  estadoActual!: IEstadoActual;

  constructor() {
    this.setearInicial();
  }

  setearInicial () {
    this.tiempoProximaLLegada = MAX_NUMBER;
    this.finReparador1 = MAX_NUMBER + 1;
    this.finReparador2 = MAX_NUMBER + 2;
    this.finReparador3 = MAX_NUMBER + 3;
    this.tiempoProximoEvento = 0;
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
    this.iniciarSimulacion(minutos)
  }

  iniciarSimulacion (tiempo: number) {
    this.generarEstadoInicial();

    // llamar al tiempo que sigue
    this.tiempoProximoEvento = this.estadoActual.llegadas.tiempoProximaLlegada;
    this.tiempoProximaLLegada = this.estadoActual.llegadas.tiempoProximaLlegada;


    while (this.tiempoProximoEvento < tiempo) {
      this.gestorSimulacion.next(this.estadoActual)

      const clienteEsperando = this.hayClienteEsperando();
      const reparadorLibre = this.hayReparadorLibre();

      if(clienteEsperando && reparadorLibre) {
        this.generarInicioAtencion(clienteEsperando, Number(reparadorLibre))
      } else {

        const proxEvento = Math.min(this.tiempoProximaLLegada, this.finReparador1, this.finReparador2, this.finReparador3);
        this.tiempoProximoEvento = proxEvento;

        switch (proxEvento) {
          case this.tiempoProximaLLegada:
            this.generarProximaLlegada()
            break;
          case this.finReparador1:
            this.generarFinAtencion(1);
            break;
          case this.finReparador2:
            this.generarFinAtencion(2)
            break;
          case this.finReparador3:
            this.generarFinAtencion(3)
            break;
        }
      }
    }
    this.precioEmitir.next(this.precioTotal);
    this.gastosEmitir.next(this.gastoTotal);
   }

  hayClienteEsperando() {
    return this.estadoActual.colaClientes.find((cliente) => cliente.estado === CLIENTE_PENDIENTE);
   }

  hayReparadorLibre() {
    const keys = Object.keys(this.estadoActual.reparadores);
    return keys.find((key) =>
      this.estadoActual.reparadores[Number(key)].estado === REPARADOR_LIBRE);
  }

  generarEstadoInicial () {
    const llegadaInicial = obtenerTiempoEntreLlegada();

    const llegadasNuevas = {
      tiempoEntreLlegadas: llegadaInicial,
      tiempoProximaLlegada: llegadaInicial
    }

    const nuevoEstado = {
      ...inicialAppState,
      llegadas: llegadasNuevas,
    };

    this.estadoActual = {...nuevoEstado}
  }

  generarProximaLlegada () {
    // calculamos el orden del cliente
    const nuevoOrden =  this.estadoActual.colaClientes?.length + 1 ?? 1;
    const nuevoCliente: ICliente = {
      estado: CLIENTE_PENDIENTE,
      orden: nuevoOrden,
    };

    this.estadoActual.largoCola += 1;
    this.estadoActual.cliente = nuevoCliente;

    const reparadorLibre = this.hayReparadorLibre();
    const reparadores = {...this.estadoActual.reparadores};

    if(reparadorLibre) {
      const reparadorOcupado = this.generarReparadorOcupado(nuevoCliente);
      reparadores[Number(reparadorLibre)] = {...reparadorOcupado};
      nuevoCliente.estado = CLIENTE_SIENDO_ATENDIDO;
      this.estadoActual.largoCola -= 1;
      switch(reparadorLibre) {
        case '1':
          this.finReparador1 = this.estadoActual.reloj + reparadorOcupado.tiempoProximaAtencion;
          break;
        case '2':
          this.finReparador2 = this.estadoActual.reloj + reparadorOcupado.tiempoProximaAtencion;
          break;
        case '3':
          this.finReparador3 = this.estadoActual.reloj + reparadorOcupado.tiempoProximaAtencion;
          break;
      }
    }

    const nuevaLLegada = obtenerTiempoEntreLlegada();

    const nuevoEstado = {
      ...this.estadoActual,
      reloj: this.tiempoProximaLLegada,
      evento: LLEGADA_CLIENTE,
      colaClientes: [...this.estadoActual.colaClientes, nuevoCliente],
      llegadas: {
        tiempoEntreLlegadas: nuevaLLegada,
        tiempoProximaLlegada: this.tiempoProximaLLegada + nuevaLLegada,
      },
      reparadores: reparadores,
    }

    this.tiempoProximaLLegada += nuevaLLegada;
    this.estadoActual = Object.assign({}, nuevoEstado)

  }

  generarReparadorOcupado (cliente: ICliente) {
    const nuevoTiempoAtencion = obtenerTiempoAtencion();
    const nuevoPrecio = nuevoTiempoAtencion > 30 ? 0 : obtenerPrecioAtencion();

    this.precioTotal += nuevoPrecio;
    this.gastoTotal += nuevoPrecio * 0.25;


    return {
      estado: REPARADOR_OCUPADO,
      cliente: cliente,
      tiempoAtencion: nuevoTiempoAtencion,
      tiempoProximaAtencion: this.tiempoProximaLLegada + nuevoTiempoAtencion,
      precio: nuevoPrecio,
      gastos: nuevoPrecio * 0.25,
    }

  }
  generarReparadorLibre (): IReparador{
    return {
      estado: REPARADOR_LIBRE,
      cliente: undefined,
      tiempoAtencion: 0,
      tiempoProximaAtencion: 0,
      precio: 0,
      gastos: 0,
    }
  }

  finalizarAtencionCliente(cliente: ICliente | undefined) {
    const colaClientes: ICliente[] = this.estadoActual.colaClientes;

    const clienteActualizar = colaClientes.find((cli: { orden: number; }) => cli.orden === cliente?.orden);
    if(clienteActualizar)
      clienteActualizar.estado= CLIENTE_FINALIZADO;
  }


  generarInicioAtencion(cliente: ICliente, reparador: number) {

    cliente.estado = CLIENTE_SIENDO_ATENDIDO;

    const reparadorNuevo = this.generarReparadorOcupado(cliente);

    this.estadoActual.largoCola -= 1;

    const reparadores = {...this.estadoActual.reparadores};

    reparadores[reparador] = {...reparadorNuevo};

    let relojNuevo = reparadores[reparador].tiempoProximaAtencion ;

    switch(reparador) {
      case 1:
        this.finReparador1 = this.estadoActual.reloj + reparadorNuevo.tiempoProximaAtencion;
        break;
      case 2:
        this.finReparador2 = this.estadoActual.reloj + reparadorNuevo.tiempoProximaAtencion;
        break;
      case 3:
        this.finReparador3 = this.estadoActual.reloj + reparadorNuevo.tiempoProximaAtencion;
        break;
    }

    const nuevoEstado = {
      ...this.estadoActual,
      reloj: relojNuevo,
      evento: REPARADOR_LIBRE,
      reparadores: reparadores,
    }


    this.estadoActual = Object.assign({}, nuevoEstado)
  }

  generarFinAtencion (reparador: number) {
    const clienteEsperando = this.hayClienteEsperando();

    const reparadores = {...this.estadoActual.reparadores};

    this.finalizarAtencionCliente(reparadores[reparador].cliente);

    let relojNuevo = reparadores[reparador].tiempoProximaAtencion ;
    let reparadorNuevo!: IReparador;

    if(clienteEsperando) {
      reparadorNuevo = this.generarReparadorOcupado(clienteEsperando);
      clienteEsperando.estado = CLIENTE_SIENDO_ATENDIDO;
      this.estadoActual.largoCola -= 1;

    } else {
      reparadorNuevo = this.generarReparadorLibre();
    }
    reparadores[reparador] = {...reparadorNuevo};
    switch(reparador) {
      case 1:
        this.finReparador1 += clienteEsperando? reparadorNuevo.tiempoProximaAtencion : MAX_NUMBER;
        break;
      case 2:
        this.finReparador2 += clienteEsperando? reparadorNuevo.tiempoProximaAtencion : MAX_NUMBER;
        break;
      case 3:
        this.finReparador3 += clienteEsperando? reparadorNuevo.tiempoProximaAtencion : MAX_NUMBER;
        break;
    }

    const nuevoEstado = {
      ...this.estadoActual,
      reloj: relojNuevo,
      evento: REPARADOR_LIBRE,
      reparadores: reparadores,
    }


    this.estadoActual = Object.assign({}, nuevoEstado)
  }
}
