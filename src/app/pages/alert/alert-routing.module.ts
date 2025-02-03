import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertHistoryComponent } from './alert-history/alert-history.component';
import { AlertComponent } from './alert.component';

const routes: Routes = [{
  path: '',
  component: AlertComponent,
  children: []},
  { 
    path: 'history',
    component: AlertHistoryComponent,
    children: []
  },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertRoutingModule { }
