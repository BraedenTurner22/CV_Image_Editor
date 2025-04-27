import { Routes } from '@angular/router';
import { AuthGuard } from './login/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login', component: LoginComponent },
        {
            path: 'dashboard',
            component: DashboardComponent,
            canActivate: [AuthGuard]
        }
];
q   