import { Routes, RouterModule } from '@angular/router';
import { NavbarComponent } from './users-navbar/navbar.component';
import { PenaltiesListComplaintComponent } from './components/complaintComponents/penalties-list-complaint/penalties-list-complaint.component';
import { PenaltiesPostComplaintComponent } from './components/complaintComponents/penalties-post-complaint/penalties-post-complaint.component';
import { PenaltiesSanctionsReportListComponent } from './components/sanctionsComponents/penalties-sanctions-report-list/penalties-sanctions-report-list.component';
import { PenaltiesPostFineComponent } from './components/sanctionsComponents/penalties-post-fine/penalties-post-fine.component';
//recordar que hay que exportarlo
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
        },
        {
          path: 'reportList',
          component: PenaltiesSanctionsReportListComponent,
        },
        {
          path: 'postFine',
          component: PenaltiesPostFineComponent,
        },
      ]
    },


];

export const PenaltiesRoutes = RouterModule.forChild(routes);
