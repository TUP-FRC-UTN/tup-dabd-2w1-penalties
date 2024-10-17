import { Routes } from '@angular/router';
import { ListComplaintsComponent } from './components/list-complaints/list-complaints.component';
import { ConsultarDenunciaModalComponent } from './components/modal-complaint/consultar-denuncia-modal.component';
import { PostComplaintComponent } from './components/post-complaint/post-complaint.component';
import { ReportModifyComponent } from './components/report-modify/report-modify.component';

export const routes: Routes = [
    { path: '', redirectTo: '/list', pathMatch: 'full' },
    { path: 'list', component: ListComplaintsComponent },
    { path: 'postComplaint', component: PostComplaintComponent },
    { path: 'putReport', component: ReportModifyComponent }
];
