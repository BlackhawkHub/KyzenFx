import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LinkResetPasswordComponent } from './link-reset-password/link-reset-password.component';
import { PasswordChangeComponent } from './password-change/password-change.component';


@NgModule({
  declarations: [LoginComponent, RegisterComponent, ResetPasswordComponent, ChangePasswordComponent, LinkResetPasswordComponent, PasswordChangeComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
