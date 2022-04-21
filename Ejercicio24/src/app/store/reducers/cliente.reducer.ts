import { createReducer, on } from "@ngrx/store";
import { ICliente } from "src/app/Interfaces/ICliente";
import { CLIENTE_SIENDO_ATENDIDO, CLIENTE_PENDIENTE, CLIENTE_FINALIZADO } from "src/app/utils/estados";
import * as clienteStates from '../actions/cliente.action';

export const inicialColaClientesState: ICliente[] = []

export const colaClientesReducer = createReducer(
    inicialColaClientesState,
    on(clienteStates.encolarCliente, (state, {ultimoOrden}) => ([...state, {estado: CLIENTE_PENDIENTE, orden: ultimoOrden+1}])),
    on(clienteStates.atenderCliente, (state, {ordenCliente}) => [...state, state[ordenCliente] = {estado:CLIENTE_SIENDO_ATENDIDO, orden: ordenCliente}]),
    on(clienteStates.liberarCliente, (state, {ordenCliente}) => [...state, state[ordenCliente] = {estado:CLIENTE_FINALIZADO, orden: ordenCliente}]),
);
