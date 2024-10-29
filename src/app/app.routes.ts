import { Routes } from '@angular/router';
import { UsersNavbarComponent } from './users-navbar/users-navbar.component'; 

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
        path: 'home', component: UsersNavbarComponent,
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
