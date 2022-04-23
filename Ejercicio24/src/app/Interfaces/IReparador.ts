import { ICliente } from "./ICliente";

export interface I3Reparadores {
  [key: number]: IReparador,
}

export interface IReparador {
  estado: string,
  cliente?: ICliente,
  tiempoAtencion: number,
  tiempoProximaAtencion: number,
  precio: number,
  gastos: number,
}
