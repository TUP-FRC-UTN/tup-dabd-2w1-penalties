import { Routes } from '@angular/router';
import { PenaltiesPostComplaintComponent } from './components/complaintComponents/penalties-post-complaint/penalties-post-complaint.component';
import { PenaltiesListComplaintComponent } from './components/complaintComponents/penalties-list-complaint/penalties-list-complaint.component';

export const routes: Routes = [
    { path: '', redirectTo: '/list', pathMatch: 'full' },  
    { path: 'list', component: PenaltiesListComplaintComponent },  
    { path: 'postComplaint', component: PenaltiesPostComplaintComponent },  
];
