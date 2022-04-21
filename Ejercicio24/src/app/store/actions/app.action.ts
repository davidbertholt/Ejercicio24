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

export const encolarCliente = createAction('[CLIENTE] NUEVO EN COLA',
    props<{
        timepo: number,
        colaActualizada: ICliente[],
        tiempoEntreLlegadas: number,
        tiempoProximaLlegada: number,
    }>()
);
export const atenderCliente = createAction('[CLIENTE] ATENDER',
    props<{
        ordenCliente: number,
    }>()
);

export const liberarCliente = createAction('[CLIENTE] LIBERAR',
    props<{
        ordenCliente: number,
    }>()
);

