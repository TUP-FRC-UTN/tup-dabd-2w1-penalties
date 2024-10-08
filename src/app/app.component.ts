import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConsultarDenunciaModalComponent } from './components/consultar-denuncia-modal/consultar-denuncia-modal.component';
import { ConsultarInformeModalComponent } from "./components/consultar-informe-modal/consultar-informe-modal.component";
//import {components} from './components'
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ConsultarDenunciaModalComponent, ConsultarInformeModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'template-app';
}
