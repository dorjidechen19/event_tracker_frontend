import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import {DashboardComponent} from "./dashboard/dashboard.component";
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

export const routes: Routes = [
  {path: '', component:LoginComponent},
  {path: 'signup', component:SignupComponent},
  {path: 'login', component:LoginComponent},
  { path: 'dashboard', component: DashboardComponent },
  
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent }
  ];
