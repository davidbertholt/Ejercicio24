import { INFERIOR_LLEGADA, INFERIOR_PRECIO, MEDIA_EXPONENCIAL, SUPERIOR_LLEGADA, SUPERIOR_PRECIO } from "./contantes";

function obtenerUniforme (limiteInferior: number, limiteSuperior: number): number {
    return limiteInferior +  Math.random() * (limiteSuperior - limiteInferior);
}

function obtenerExponencial (media: number): number  {
    return -media * Math.log(1-Math.random());
}

export function horasAMiutos ( horas: number ): number  {return horas * 60;}

export function formateoMinutosAString (tiempo: number): string {
    const horas = Math.trunc(tiempo / 60);
    const minutos = Math.trunc(tiempo % 60);
    const minutos2Cifras = `${minutos}`.length > 1 ? minutos : `0${minutos}`

    return `${horas}:${minutos2Cifras}`
}

export function obtenerTiempoEntreLlegada (): number {
  return obtenerUniforme(INFERIOR_LLEGADA, SUPERIOR_LLEGADA);
}

export function obtenerTiempoAtencion (): number {
  return obtenerExponencial(MEDIA_EXPONENCIAL);
}

export function obtenerPrecioAtencion (): number {
  return obtenerUniforme(INFERIOR_PRECIO, SUPERIOR_PRECIO);
}
