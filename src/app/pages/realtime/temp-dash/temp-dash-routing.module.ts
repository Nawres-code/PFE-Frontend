import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TempDashComponent } from './temp-dash.component';
const routes: Routes = [
 // { path: '', redirectTo: '/pages/realtime/dashboard', pathMatch: 'full' },

  { path: '',
    component: TempDashComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TempDashRoutingModule {
}
