import { Routes, RouterModule } from '@angular/router';
import { UsersNavbarComponent } from '../../users-navbar/users-navbar.component'; 
import { PenaltiesSanctionsReportListComponent } from './penalties-sanctions-report-list/penalties-sanctions-report-list.component';
import { PenaltiesPostFineComponent } from './penalties-post-fine/penalties-post-fine.component';
import { PenaltiesPostDisclaimerComponent } from './penalties-post-disclaimer/penalties-post-disclaimer.component';
import { PenaltiesSanctionsListComponent } from './penalties-sanctions-list/penalties-sanctions-list.component';
import { ReportModifyComponent } from '../report-modify/report-modify.component';
import { PenaltiesModalFineComponent } from './modals/penalties-modal-fine/penalties-modal-fine.component';

export const routes: Routes = [
    {
      path: '',
      component: UsersNavbarComponent,
      children:[
        {
          path: 'reportList',
          component: PenaltiesSanctionsReportListComponent,
        },
        {
          path: 'postFine',
          component: PenaltiesPostFineComponent,
        },
        {
          path: 'postDisclaimer/:fineId',
          component: PenaltiesPostDisclaimerComponent,
        },
        {
          path: 'sanctionsList',
          component: PenaltiesSanctionsListComponent,
        },
        {
          path: 'putReport',
          component: ReportModifyComponent
        }
      ]
    },

];

export const SanctionRoutingRoutes = RouterModule.forChild(routes);
