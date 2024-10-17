import { Routes } from '@angular/router';
import { NavbarComponent } from './users-navbar/navbar.component';

export const routes: Routes = [
    { path: '', redirectTo: '/navbar', pathMatch: 'full' },  
    {  path: 'navbar', component: NavbarComponent },
    {
        path: 'home',
        loadChildren: () => import('./penalties.routing').then(m => m.routes)

    },
];
