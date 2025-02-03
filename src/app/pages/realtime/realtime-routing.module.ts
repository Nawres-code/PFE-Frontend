import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RealtimeComponent } from './realtime.component';

const routes: Routes = [{
  path: '',
  component: RealtimeComponent,
  children: [
    { path: '', redirectTo: '/pages/realtime/cdc/dashboard', pathMatch: 'full' },
    {
      path: 'cdc',
      loadChildren: () => import('./cdc-dash/cdc-dash.module')
        .then(m => m.CdcDashModule),
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RealtimeRoutingModule {
}
