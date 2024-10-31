import { Routes, RouterModule } from '@angular/router';
import { UsersNavbarComponent } from '../users-components/users-navbar/users-navbar.component'; 
import { PenaltiesPostComplaintComponent } from './penalties-post-complaint/penalties-post-complaint.component';
import { PenaltiesListComplaintComponent } from './penalties-list-complaints/penalties-list-complaints.component';
import { ReportModifyComponent } from '../sanctionsComponents/sanctions-update-report/sanctions-update-report.component';

export const routes: Routes = [
  {
    path: '',
    component: UsersNavbarComponent,
    children:[
      {
        path: 'listComplaint',
        component: PenaltiesListComplaintComponent,
      },
      {
        path: 'postComplaint',
        component: PenaltiesPostComplaintComponent,
      }
    ]
  },

];

export const ComplaintRoutingRoutes = RouterModule.forChild(routes);
