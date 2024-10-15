import { Routes } from '@angular/router';
import { ListComplaintsComponent } from './components/list-complaints/list-complaints.component';
import { ConsultarDenunciaModalComponent } from './components/modal-complaint/consultar-denuncia-modal.component';
import { PostComplaintComponent } from './components/post-complaint/post-complaint.component';
import { PostFineComponent } from './components/post-fine/post-fine.component';

export const routes: Routes = [
    { path: '', redirectTo: '/list', pathMatch: 'full' },  
    { path: 'list', component: ListComplaintsComponent },  
    { path: 'postComplaint', component: PostComplaintComponent },  
    { path: 'postFine', component: PostFineComponent}
];
