import { ICliente } from "../Interfaces/ICliente";
import { CLIENTE_PENDIENTE, CLIENTE_SIENDO_ATENDIDO } from "./nombreDeEstados";

export function generarNuevoCliente (orden: number, reparadorLibre: string | undefined): ICliente {
  // seteo estado del cliente
  return {
    estado: reparadorLibre? CLIENTE_SIENDO_ATENDIDO : CLIENTE_PENDIENTE,
    orden: orden + 1,
  }
}
