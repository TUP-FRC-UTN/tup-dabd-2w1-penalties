import { Routes } from '@angular/router';
import { PenaltyHomeComponent } from '../penalty-home/penalty-home.component';
import { PenaltiesSanctionsReportListComponent } from './penalties-list-report/penalties-list-report.component';
import { PenaltiesPostFineComponent } from './penalties-post-fine/penalties-post-fine.component';
import { PenaltiesPostDisclaimerComponent } from './penalties-post-disclaimer/penalties-post-disclaimer.component';
import { PenaltiesSanctionsListComponent } from './penalties-list-sanctions/penalties-list-sanctions.component';
import { ReportModifyComponent } from './sanctions-update-report/sanctions-update-report.component';
import { NewReportComponent } from '../penalties-post-report/penalties-post-report.component';
import { PenaltiesUpdateFineComponent } from './penalties-update-fine/penalties-update-fine.component';
import { PenaltiesFineDashboardComponent } from './penalties-fine-dashboard/penalties-fine-dashboard.component';

export const SANCTION_ROUTES: Routes = [
  { path: 'report-list', component: PenaltiesSanctionsReportListComponent },
  { path: 'post-fine/:id', component: PenaltiesPostFineComponent },
  {
    path: 'post-disclaimer/:fineId',
    component: PenaltiesPostDisclaimerComponent,
  },
  { path: 'sanctions-list', component: PenaltiesSanctionsListComponent },
  { path: 'put-report', component: ReportModifyComponent },
  { path: 'post-report', component: NewReportComponent },
  { path: 'put-fine/:fineId', component: PenaltiesUpdateFineComponent },
  { path: 'dashboard', component: PenaltiesFineDashboardComponent }, // Cambiar por el componente correspondiente
];
