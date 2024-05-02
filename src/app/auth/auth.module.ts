import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { PrimengModule } from '../primeng/primeng.module';
import { LoginHomepageComponent } from './login-homepage/login-homepage.component';
import { SharedModulesModule } from '../shared-modules/shared-modules.module';
import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [
    LoginComponent,
    ForgetPasswordComponent,
    LoginHomepageComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    PrimengModule,
    SharedModulesModule
  ]
})
export class AuthModule { }
