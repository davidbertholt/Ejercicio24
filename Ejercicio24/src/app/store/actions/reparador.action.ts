import { createAction, props } from "@ngrx/store";
import { ICliente } from "src/app/Interfaces/ICliente";

export const liberarReparador = createAction('[REPARADOR] LIBERAR',
    props<{
        idReparador: number,
    }>()
);

export const atenderProximoCliente = createAction('[REPARADOR] OCUPAR',
    props<{
        relojActual: number,
        tiempoFinAtencionDU: number,
        precioDU: number,
        nuevoCliente: ICliente,
        idReparador: number
    }>()
);
