import { Routes } from '@angular/router';
import { Home } from './app/page/home/home';
import { Login } from './app/page/login/login';
import { Signup } from './app/page/signup/signup';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: '**', redirectTo: '/login' },
];
