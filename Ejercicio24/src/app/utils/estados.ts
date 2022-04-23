import { ICliente } from "../Interfaces/ICliente";
import { INIICIO_SIMULACION } from "./eventos";
import { REPARADOR_LIBRE } from "./nombreDeEstados";

const inicialColaClientesState: ICliente[] = [];

const inicialReparadorState = {
  estado: REPARADOR_LIBRE,
  cliente: {
    orden: 0,
    estado: "-"
  },
  tiempoAtencion: 0,
  tiempoProximaAtencion: 0,
  precio: 0,
  gastos: 0
};

let inicialLlegadaClientes = {
  tiempoEntreLlegadas: 0,
  tiempoProximaLlegada: 0,
}

export const inicialAppState = {
  reloj: 0,
  evento: INIICIO_SIMULACION,
  cliente: {
    orden: 0,
    estado: "-"
  },
  colaClientes: inicialColaClientesState,
  largoCola: 0,
  llegadas: inicialLlegadaClientes,
  reparadores: {
      1: inicialReparadorState,
      2: inicialReparadorState,
      3: inicialReparadorState,
  }
}
