import { Injectable } from '@angular/core';
import { GestorEventosService } from './gestor-eventos.service';

@Injectable({
  providedIn: 'root'
})
export class RelojService {

  constructor( private gestorEvento$: GestorEventosService) { }

  startReloj(horas: number) {
    this.gestorEvento$.start(horas);
  }

  restart() {
    this.gestorEvento$.restart();
  }
}
