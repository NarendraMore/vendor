import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginHomepageComponent } from './login-homepage/login-homepage.component';

const routes: Routes = [
  {
    path: '',
    pathMatch:'full',
    component: LoginHomepageComponent
  },
  {
    path: 'loginWithPwc',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
