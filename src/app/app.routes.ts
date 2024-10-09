import { Routes } from '@angular/router';
import { ListComplaintsComponent } from './components/list-complaints/list-complaints.component';

export const routes: Routes = [
    { path: '', redirectTo: '/listado', pathMatch: 'full' },  
    { path: 'listado', component: ListComplaintsComponent },  
];
