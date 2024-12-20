import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import {DashboardComponent} from "./dashboard/dashboard.component";
import { NavComponent } from './nav/nav.component';

export const routes: Routes = [
  {path: '', component:LoginComponent},
  {path: 'signup', component:SignupComponent},
  {path: 'login', component:LoginComponent},
  { path: 'dashboard', component: DashboardComponent },
  {path: 'nav', component: NavComponent}
  ];
