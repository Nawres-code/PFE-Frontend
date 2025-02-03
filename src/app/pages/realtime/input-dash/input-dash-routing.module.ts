import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { InputDashComponent } from './input-dash.component';
const routes: Routes = [
 // { path: '', redirectTo: '/pages/realtime/dashboard', pathMatch: 'full' },

  { path: '',
    component: InputDashComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InputDashRoutingModule {
}
