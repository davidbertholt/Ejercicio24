import { createReducer, on } from "@ngrx/store";

//Interfaces
import { ICliente } from "src/app/Interfaces/ICliente";

// Estados
import { CLIENTE_PENDIENTE, REPARADOR_LIBRE } from "src/app/utils/estados";
import { INIICIO_SIMULACION, LLEGADA_CLIENTE } from "src/app/utils/eventos";
import { obtenerTiempoEntreLlegada } from "src/app/utils/funciones_datos";

// Actions
import * as appStates from '../actions/app.action';

const inicialColaClientesState: ICliente[] = [];

const inicialReparadorState = {
        orden: 0,
        estado: REPARADOR_LIBRE,
        cliente: {},
        tiempoAtencion: 0,
        tiempoProximaAtencion: 0,
        precio: 0,
        gastos: 0
};

const llegadaInicial = obtenerTiempoEntreLlegada();

const inicialLlegadaClientes = {
    tiempoEntreLlegadas: llegadaInicial,
    tiempoProximaLlegada: llegadaInicial,
}

export const inicialAppState = {
    reloj: 0,
    evento: INIICIO_SIMULACION,
    cliente: {},
    colaClientes: inicialColaClientesState,
    llegadas: inicialLlegadaClientes,
    reparadores: {
        1: inicialReparadorState,
        2: inicialReparadorState,
        3: inicialReparadorState,
    }
}

export const appReducer = createReducer(
    inicialAppState,
    on(appStates.encolarCliente, (state, {timepo, colaActualizada, tiempoEntreLlegadas, tiempoProximaLlegada}) => (
        {
            ...state,
            reloj: timepo,
            evento: LLEGADA_CLIENTE,
            colaClientes: colaActualizada,
            llegadas: {
                tiempoEntreLlegadas: tiempoEntreLlegadas,
                tiempoProximaLlegada: tiempoProximaLlegada,
            }
    })),
)

