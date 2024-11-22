import { Routes } from '@angular/router';
import { PenaltiesListComplaintComponent } from './penalties-list-complaints/penalties-list-complaints.component';
import { PenaltiesPostComplaintComponent } from './penalties-post-complaint/penalties-post-complaint.component';
import { PenaltiesComplaintDashboardComponent } from './penalties-complaint-dashboard/penalties-complaint-dashboard.component';

export const COMPLAINT_ROUTES: Routes = [
  { path: 'list-complaint', component: PenaltiesListComplaintComponent },
  { path: 'post-complaint', component: PenaltiesPostComplaintComponent },
  { path: 'dashboard', component: PenaltiesComplaintDashboardComponent },
];
