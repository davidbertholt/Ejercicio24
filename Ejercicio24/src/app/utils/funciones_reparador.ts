import { IReparador } from "../Interfaces/IReparador";
import { obtenerPrecioAtencion, obtenerTiempoAtencion } from "./funciones_datos";
import { REPARADOR_LIBRE, REPARADOR_OCUPADO } from "./nombreDeEstados";

export function generarReparadorOcupado (tiempoActual: number): IReparador {
  const nuevoTiempoAtencion = obtenerTiempoAtencion();
  const nuevoPrecio = nuevoTiempoAtencion > 30 ? 0 : obtenerPrecioAtencion();

  return {
    estado: REPARADOR_OCUPADO,
    cliente: undefined,
    tiempoAtencion: nuevoTiempoAtencion,
    tiempoProximaAtencion: tiempoActual + nuevoTiempoAtencion,
    precio: nuevoPrecio,
    gastos: nuevoPrecio * 0.25,
  }
}

export function generarReparadorLibre (): IReparador {
  // SIEMPRE TENER EN CUENTA QUE NUESTRO PROXIMO TIEMPO DE ESTE REPARADOR DEBE SER EL MAXIMO NUMERO
  return {
    estado: REPARADOR_LIBRE,
    cliente: undefined,
    tiempoAtencion: 0,
    tiempoProximaAtencion: 0,
    precio: 0,
    gastos: 0,
  }
}
