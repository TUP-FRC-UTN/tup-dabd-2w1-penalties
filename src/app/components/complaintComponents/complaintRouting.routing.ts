import { Routes, RouterModule } from '@angular/router';
import { UsersNavbarComponent } from '../../users-navbar/users-navbar.component'; 
import { PenaltiesPostComplaintComponent } from './penalties-post-complaint/penalties-post-complaint.component';
import { PenaltiesListComplaintComponent } from './penalties-list-complaint/penalties-list-complaint.component';
import { ReportModifyComponent } from '../report-modify/report-modify.component';

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
