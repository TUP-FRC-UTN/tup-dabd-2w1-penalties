import { Routes, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../users-navbar/navbar.component';
import { PenaltiesSanctionsReportListComponent } from './penalties-sanctions-report-list/penalties-sanctions-report-list.component';
import { PenaltiesPostFineComponent } from './penalties-post-fine/penalties-post-fine.component';
import { PenaltiesPostDisclaimerComponent } from './penalties-post-disclaimer/penalties-post-disclaimer.component';

export const routes: Routes = [
    {
      path: '',
      component: NavbarComponent,
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
          path: 'postDisclaimer',
          component: PenaltiesPostDisclaimerComponent,
        },
      ]
    },

];

export const SanctionRoutingRoutes = RouterModule.forChild(routes);
