import { Routes } from '@angular/router';
import { LoginPageComponent } from './page/login-page/login-page.component';
import { RegisterPageComponent } from './page/register-page/register-page.component';
import { ProfilePageComponent } from './page/profile-page/profile-page.component';

import { CategoryDetailComponent } from './page/profile-page/category-detail/category-detail.component';
import { WelcomeComponent } from './page/profile-page/welcome/welcome.component';
import { AuthGuard } from '../auth/guard/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full', },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'profile', component: ProfilePageComponent, children: [
    { path: '', component: WelcomeComponent },
    { path: 'category/:id', component: CategoryDetailComponent },
  ], canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];
