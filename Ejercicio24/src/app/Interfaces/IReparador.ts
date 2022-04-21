import { ICliente } from "./ICliente";

export interface IReparador {
    numero: number,
    estado: string,
    cliente: ICliente,
}