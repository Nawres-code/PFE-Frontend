import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { EnergyDashComponent } from './energy-dash.component';
import { InstallationComponent } from './installation/installation.component';
import { ZoneComponent } from './zone/zone.component';
import { DashboardComponent } from './dashboard/dashboard.component';
const routes: Routes = [{
  path: '',
  component: EnergyDashComponent,
  children: [
    { path: '', redirectTo: '/pages/realtime/energy/dashboard', pathMatch: 'full' },
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'installation',
      component: InstallationComponent,
    },
    {
      path: 'zone',
      component: ZoneComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnergyRoutingModule {
}
