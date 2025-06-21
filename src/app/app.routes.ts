import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component.ts/login.component.ts.js';
import { ModeratorDashboard } from './moderator/moderator-dashboard/moderator-dashboard.js';
import { Signup } from './auth/signup/signup.js';

export const routes: Routes = [
  { path: 'login', component:LoginComponent },
//   { path: '', component: }, 
  { path: 'moderator', component:ModeratorDashboard},
  { path: 'voter-signup', component: Signup }
];