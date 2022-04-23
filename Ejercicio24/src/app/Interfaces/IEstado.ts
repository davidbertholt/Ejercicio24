import { ICliente } from "./ICliente"
import { I3Reparadores } from "./IReparador"

export interface IEstadoActual {
  reloj: number,
  evento: string,
  cliente?: ICliente | any,
  colaClientes: ICliente[],
  largoCola: number,
  llegadas: {
      tiempoEntreLlegadas: number,
      tiempoProximaLlegada: number
    },
    reparadores: I3Reparadores
}
