import { Routes, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../users-navbar/navbar.component';
import { PenaltiesPostComplaintComponent } from './penalties-post-complaint/penalties-post-complaint.component';
import { PenaltiesListComplaintComponent } from './penalties-list-complaint/penalties-list-complaint.component';

export const routes: Routes = [
  {
    path: '',
    component: NavbarComponent,
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
