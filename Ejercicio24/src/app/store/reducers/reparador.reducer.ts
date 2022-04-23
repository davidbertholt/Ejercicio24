import { createReducer, on } from "@ngrx/store";
import { REPARADOR_LIBRE, REPARADOR_OCUPADO } from "src/app/utils/nombreDeEstados";
import * as reparadorStates from '../actions/reparador.action';

export const inicialReparadorState = {
    1: {
        orden: 0,
        estado: REPARADOR_LIBRE,
        cliente: {},
        tiempoAtencion: 0,
        tiempoProximaAtencion: 0,
        precio: 0,
        gastos: 0
    },
    2: {
        estado: REPARADOR_LIBRE,
        cliente: {},
        tiempoAtencion: 0,
        tiempoProximaAtencion: 0,
        precio: 0,
        gastos: 0
    },
    3: {
        estado: REPARADOR_LIBRE,
        cliente: {},
        tiempoAtencion: 0,
        tiempoProximaAtencion: 0,
        precio: 0,
        gastos: 0
    }
}

export const reparadorReducer = createReducer(
    inicialReparadorState,
    on(reparadorStates.atenderProximoCliente, (state, {relojActual, tiempoFinAtencionDU, precioDU, nuevoCliente, idReparador}) => (
        {
            ...state,
            [idReparador]:
            {
                estado: REPARADOR_OCUPADO,
                tiempoAtencion:  tiempoFinAtencionDU,
                tiempoProximaAtencion:  tiempoFinAtencionDU + relojActual,
                precio: tiempoFinAtencionDU > 30 ? 0 : precioDU,
                gastos: 0.25 * precioDU,
                cliente: nuevoCliente
            }
        })
    ),
    on(reparadorStates.liberarReparador, (state,{idReparador}) => (
        {
            ...state,
            [idReparador]:
            {
                estado: REPARADOR_LIBRE,
                tiempoAtencion:  0,
                tiempoProximaAtencion: 0,
                precio: 0,
                gastos: 0,
                cliente: {}
            }
        })
    ),
);

