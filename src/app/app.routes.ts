import { Routes } from '@angular/router';
import { NavbarComponent } from './users-navbar/navbar.component';

export const routes: Routes = [
    { path: '', redirectTo: '/navbar', pathMatch: 'full' },  
    {  path: 'navbar', component: NavbarComponent },
    {  path: 'home', component: NavbarComponent ,
        children: [
        {
          path: 'complaints',
          loadChildren: () => import('./components/complaintComponents/complaintRouting.routing').then(m => m.routes)
        },
        {
            path: 'sanctions',
            loadChildren: () => import('./components/sanctionsComponents/sanctionRouting.routing').then(m => m.routes)
        },
        ]
    }
];
