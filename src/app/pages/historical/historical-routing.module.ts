import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HistoricalComponent } from './historical.component';
import { DetailsComponent } from './details/details.component';
import { ComparatorComponent } from './comparator/comparator.component';
import { EnergyComponent } from './energy/energy.component';
import { SensorComponent } from './sensor/sensor.component';

const routes: Routes = [{
  path: '',
  component: HistoricalComponent,
  children: [
    {
      path: 'energy',
      component: EnergyComponent,
    },
    {
      path: 'details',
      component: DetailsComponent,
    },
    {
      path: 'sensor',
      component: SensorComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoricalRoutingModule {
}
