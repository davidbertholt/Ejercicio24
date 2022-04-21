import { createAction, props } from "@ngrx/store";

export const encolarCliente = createAction('[CLIENTE] EN COLA',
    props<{
        ultimoOrden: number,
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