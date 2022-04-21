import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Ejercicio24';
  reloj = 0;
  horasSimulacion (horas: number) {
    console.log(horas);
    
    this.reloj = horas
  }
}
