import { Routes } from '@angular/router';
import { ListComplaintsComponent } from './components/list-complaints/list-complaints.component';
import { PostComplaintComponent } from './components/Complaints/post-complaint/post-complaint.component';

export const routes: Routes = [
    { path: '', redirectTo: '/list', pathMatch: 'full' },  
    { path: 'list', component: ListComplaintsComponent },  
    { path: 'postComplaint', component: PostComplaintComponent },  
];
