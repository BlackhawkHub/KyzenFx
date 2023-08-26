import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { SendMoneyComponent } from './send-money/send-money.component';
import { ReceipientsComponent } from './receipients/receipients.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AuthGuard } from './shared/auth.guard';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { LinkResetPasswordComponent } from './auth/link-reset-password/link-reset-password.component';
import { PasswordChangeComponent } from './auth/password-change/password-change.component';

const routes: Routes =[
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: LandingPageComponent},
  { path: 'send-money', component: SendMoneyComponent, canActivate: [AuthGuard] },
  { path: 'receipients', component: ReceipientsComponent, canActivate: [AuthGuard] },
  { path: 'transactions', component: TransactionsComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'resetPassword', component: ResetPasswordComponent },
  { path: 'passwordChange', component: PasswordChangeComponent },
  { path: 'resetPassword/changePassword', component: LinkResetPasswordComponent },
  { path: 'changePassword', component: ChangePasswordComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
})
export class AppRoutingModule { }
