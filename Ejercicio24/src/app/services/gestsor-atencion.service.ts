import { Injectable } from '@angular/core';
import { IEstadoActual } from '../Interfaces/IEstado';
import { FIN_ATENCION_CLIENTE } from '../utils/eventos';
import { generarReparadorLibre, generarReparadorOcupado } from '../utils/funciones_reparador';
import { CLIENTE_FINALIZADO, CLIENTE_SIENDO_ATENDIDO } from '../utils/nombreDeEstados';

@Injectable({
  providedIn: 'root'
})
export class GestsorAtencionService {

  constructor() {
    // NO REQUIERE COMENTARIOS
  }

  finalizarAtencionCliente(estadoActual: IEstadoActual, reparador: number): IEstadoActual {
    // Finalizamos al cliente actual
    const clienteReparador = estadoActual.reparadores[reparador].cliente;
    const indexClienteAFinalizar = estadoActual.colaClientes.findIndex((cli: { orden: number | undefined; }) => cli.orden === clienteReparador?.orden ) ?? undefined
    if (indexClienteAFinalizar >= 0) {
      estadoActual.colaClientes[indexClienteAFinalizar].estado = CLIENTE_FINALIZADO
    }

    const evento = FIN_ATENCION_CLIENTE;
    const cliente = clienteReparador;
    estadoActual.reparadores[reparador].cliente = cliente;

    let largoCola = estadoActual.largoCola;
    let colaClientes = estadoActual.colaClientes;
    const reparadores = {...estadoActual.reparadores};
    const relojActual = estadoActual.reloj;

    // debemos asignar el nuevo cliente ?
    if (largoCola > 0) { // DEBO ASIGNAR CLIENTE

      // generamos el reparador ocupado sin cliente
      const reparadorOcupado = generarReparadorOcupado(relojActual);

      // asignamos el cliente que esta proximo en la cola
      reparadorOcupado.cliente = colaClientes[indexClienteAFinalizar + 1];

      // actualizamos el cliente
      colaClientes[indexClienteAFinalizar + 1].estado = CLIENTE_SIENDO_ATENDIDO;

      // seteamos los reparadores en el estado
      reparadores[reparador] = reparadorOcupado;

      // disminuimos la cola
      largoCola -= 1;

    } else { // DEBO LIBERAR AL REARADOR
      const reparadorLibre = generarReparadorLibre();

      // lo asignamos a los reparadores
      reparadores[reparador] = reparadorLibre
    }

    return {
        ...estadoActual,
      evento,
      cliente,
      largoCola,
      colaClientes,
      reparadores,
    }

  }
}
