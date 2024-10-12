import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConsultarDenunciaModalComponent } from './components/modal-complaint/consultar-denuncia-modal.component';
import { ConsultarInformeModalComponent } from "./components/modal-report/consultar-informe-modal.component";
import { GetAllComplaintsComponent } from "./components/get-all-complaints/get-all-complaints.component";
import { PostComplaintComponent } from "./components/post-complaint/post-complaint.component";
import { ListComplaintsComponent } from "./components/list-complaints/list-complaints.component";
//import {components} from './components'
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ConsultarDenunciaModalComponent, ConsultarInformeModalComponent, GetAllComplaintsComponent, PostComplaintComponent, ListComplaintsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'template-app';
}
