import { Pipe, PipeTransform } from '@angular/core';
import { formateoMinutosAString } from '../utils/funciones_datos';

@Pipe({
  name: 'minutosAHoras'
})
export class MinutosAHorasPipe implements PipeTransform {

  transform(minutos: number): string {
    return formateoMinutosAString(minutos);
  }

}
