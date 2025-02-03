import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { SigninComponent } from './signin/signin.component';
import { AuthenticationComponent } from './authentication.component';

const routes: Routes = [{
  path: '',
  component: AuthenticationComponent,
  children: [
    {
      path: '',
      component: SigninComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {
}
