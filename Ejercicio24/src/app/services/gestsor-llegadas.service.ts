import { Injectable } from '@angular/core';
import { IEstadoActual } from '../Interfaces/IEstado';
import { IReparador } from '../Interfaces/IReparador';
import { LLEGADA_CLIENTE } from '../utils/eventos';
import { generarNuevoCliente } from '../utils/funciones_cliente';
import { obtenerTiempoEntreLlegada } from '../utils/funciones_datos';
import { generarReparadorOcupado } from '../utils/funciones_reparador';

@Injectable({
  providedIn: 'root'
})
export class GestsorLlegadasService {

  constructor() {
    // TODO: No es necesario definir el constructor
  }

  generarNuevaLLegada (estadoActual: IEstadoActual, reparadorLibre: string | undefined): IEstadoActual {
    const nuevoEstado = {...estadoActual};

    nuevoEstado.evento = LLEGADA_CLIENTE;

    const cliente = generarNuevoCliente(nuevoEstado.colaClientes.length, reparadorLibre);

    nuevoEstado.cliente = cliente;
    nuevoEstado.colaClientes = [...nuevoEstado.colaClientes, cliente];

    const tiempoEntreLlegadas = obtenerTiempoEntreLlegada();
    const tiempoProximaLlegada = nuevoEstado.reloj + tiempoEntreLlegadas;

    nuevoEstado.llegadas = {
      tiempoEntreLlegadas,
      tiempoProximaLlegada
    }

    const reparador: IReparador = reparadorLibre ?
      {...generarReparadorOcupado(nuevoEstado.reloj), cliente: nuevoEstado.cliente} :
      {...nuevoEstado.reparadores[Number(reparadorLibre)]}

    nuevoEstado.largoCola = reparadorLibre ? nuevoEstado.largoCola : nuevoEstado.largoCola + 1;

    nuevoEstado.reparadores = reparadorLibre? {
      ...estadoActual.reparadores,
      [reparadorLibre]: {...reparador}
    } : {
      ...estadoActual.reparadores,
    }

    return nuevoEstado;
  }
}
