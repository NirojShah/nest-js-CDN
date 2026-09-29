import { Routes } from '@angular/router';
import { Home } from './app/page/home/home';
import { Login } from './app/page/login/login';
import { Signup } from './app/page/signup/signup';
import { autheticationCheckGuard } from './authetication-check-guard';
import { tokenPresentGuardGuard } from './token-present-guard-guard';

export const routes: Routes = [
  { path: '', component: Home, canActivate: [autheticationCheckGuard] },
  { path: 'login', component: Login, canActivate: [tokenPresentGuardGuard] },
  { path: 'signup', component: Signup, canActivate: [tokenPresentGuardGuard] },
  { path: '**', redirectTo: '/login' },
];
