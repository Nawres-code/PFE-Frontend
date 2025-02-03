import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubAccountsComponent } from './sub-accounts/sub-accounts.component';

const routes: Routes = [{
  path: '',
  component: SubAccountsComponent,
  children: [],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubAccountsRoutingModule { }
