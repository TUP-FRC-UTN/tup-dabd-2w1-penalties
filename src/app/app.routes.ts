import { Routes } from '@angular/router';
import { UsersNavbarComponent } from './components/users-components/users-navbar/users-navbar.component'; 
import { AppComponent } from './app.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
        path: 'home', component: AppComponent,
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
