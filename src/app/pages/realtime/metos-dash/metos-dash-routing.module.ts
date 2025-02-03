import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MetosDashComponent } from './metos-dash/metos-dash.component';
const routes: Routes = [
 // { path: '', redirectTo: '/pages/realtime/dashboard', pathMatch: 'full' },

  { path: '',
    component: MetosDashComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetosDashRoutingModule {
}
