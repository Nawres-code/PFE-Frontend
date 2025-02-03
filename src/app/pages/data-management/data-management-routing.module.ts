import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataManagementComponent } from './data-management.component';
import { DeviceManagementComponent } from './device-management/device-management.component';
import { InstallationDataComponent } from './installation-data/installation-data.component';
import { SensorsManagementComponent } from './sensors-management/sensors-management.component';
import { ZonesComponent } from './zones/zones.component';
import { OperatingModeComponent } from './operating-mode/operating-mode.component';
import { AideVisuelComponent } from './aide-visuel/aide-visuel.component';

const routes: Routes = [{
  path: '',
  component: DataManagementComponent,
  children: [
    { path: 'installation', component: InstallationDataComponent },
    { path: 'zone', component: ZonesComponent },
    { path: 'device', component: DeviceManagementComponent },
    { path: 'sensor', component: SensorsManagementComponent },
    { path: 'aideVisuel', component: AideVisuelComponent },
    { path: 'operatingMode', component: OperatingModeComponent }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataManagementRoutingModule { }
