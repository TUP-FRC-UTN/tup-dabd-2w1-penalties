import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConsultarDenunciaModalComponent } from './components/Complaints/consultar-denuncia-modal/consultar-denuncia-modal.component';
import { ConsultarInformeModalComponent } from "./components/Penaltis/consultar-informe-modal/consultar-informe-modal.component";

import { PostComplaintComponent } from "./components/Complaints/post-complaint/post-complaint.component";
import { ListComplaintsComponent } from "./components/Complaints/list-complaints/list-complaints.component";

//import {components} from './components'
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ConsultarDenunciaModalComponent, ConsultarInformeModalComponent, PostComplaintComponent, ListComplaintsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'template-app';
}
