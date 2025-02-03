import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CdcDashComponent } from './cdc-dash.component';
import { ZoneCdcComponent } from './zone-cdc/zone-cdc.component';

const routes: Routes = [{
  path: '',
  component: CdcDashComponent,
  children: [
    { path: '', redirectTo: '/pages/realtime/cdc/dashborad', pathMatch: 'full' },
    {
      path: 'dashboard',
      component: ZoneCdcComponent,
    }
  ]
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CdcDashRoutingModule { }
