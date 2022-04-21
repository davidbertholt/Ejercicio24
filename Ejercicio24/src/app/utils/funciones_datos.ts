import { INFERIOR_LLEGADA, SUPERIOR_LLEGADA } from "./contantes";

export const obtenerUniforme = (limiteInferior: number, limiteSuperior: number) => {
    const amplitud = limiteSuperior - limiteInferior;
    const rnd = Math.random();
    return limiteInferior + rnd * amplitud;
};

export const obtenerExponencial = (media: number) => {
    const rnd = Math.random();
    return -media * Math.log(1-rnd);
};

export const horasAMiutos = ( horas: number ) => {return horas * 60;};

export const formateoMinutosAString = (tiempo: number) => {
    const horas = Math.trunc(tiempo / 60);
    const minutos = tiempo % 60;
    const minutos2Cifras = `${minutos}`.length > 1 ? minutos : `0${minutos}`

    return `${horas}:${minutos2Cifras}`
}

export const obtenerTiempoEntreLlegada = () => {
    return obtenerUniforme(INFERIOR_LLEGADA, SUPERIOR_LLEGADA);
}
