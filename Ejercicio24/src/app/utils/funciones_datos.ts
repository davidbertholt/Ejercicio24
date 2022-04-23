import { INFERIOR_LLEGADA, INFERIOR_PRECIO, MEDIA_EXPONENCIAL, SUPERIOR_LLEGADA, SUPERIOR_PRECIO } from "./contantes";

function obtenerUniforme (limiteInferior: number, limiteSuperior: number)  {
    const amplitud = limiteSuperior - limiteInferior;
    const rnd = Math.random();
    return limiteInferior + rnd * amplitud;
};

function obtenerExponencial (media: number)  {
    const rnd = Math.random();
    return -media * Math.log(1-rnd);
};

export function horasAMiutos ( horas: number )  {return horas * 60;};

export function formateoMinutosAString (tiempo: number)  {
    const horas = Math.trunc(tiempo / 60);
    const minutos = tiempo % 60;
    const minutos2Cifras = `${minutos}`.length > 1 ? minutos : `0${minutos}`

    return `${horas}:${minutos2Cifras}`
}

export function obtenerTiempoEntreLlegada () {
  return obtenerUniforme(INFERIOR_LLEGADA, SUPERIOR_LLEGADA);
}

export function obtenerTiempoAtencion () {
  return obtenerExponencial(MEDIA_EXPONENCIAL);
}

export function obtenerPrecioAtencion () {
  return obtenerUniforme(INFERIOR_PRECIO, SUPERIOR_PRECIO);
}
