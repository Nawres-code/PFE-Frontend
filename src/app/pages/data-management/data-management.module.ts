import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataManagementComponent } from './data-management.component';
import { ThemeModule } from '../../@theme/theme.module';
import { DataManagementRoutingModule } from './data-management-routing.module';
import { NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbRadioModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SondeComponent } from './sonde/sonde.component';
import { InstallationDataComponent } from './installation-data/installation-data.component';
import { ZonesComponent } from './zones/zones.component';
import { InputsManagementComponent } from './inputs-management/inputs-management.component';
import { CatInputsManagementComponent } from './cat-inputs-management/cat-inputs-management.component';
import { StationsManagementComponent } from './stations-management/stations-management.component';
import { SensorsManagementComponent } from './sensors-management/sensors-management.component';
import { GroupsManagementComponent } from './groups-management/groups-management.component';
import { IoImpulseManagementComponent } from './IoImpulseManagement/io-impulse-management.component';
import { TranslateModule } from '@ngx-translate/core';
import { DeviceManagementComponent } from './device-management/device-management.component';
import { FormsModule } from '@angular/forms';
import { OperatingModeComponent } from './operating-mode/operating-mode.component';
import { AideVisuelComponent } from './aide-visuel/aide-visuel.component';

@NgModule({
  declarations: [
    DataManagementComponent,
    SondeComponent,
    InstallationDataComponent,
    ZonesComponent,
    InputsManagementComponent,
    CatInputsManagementComponent,
    StationsManagementComponent,
    SensorsManagementComponent, 
    GroupsManagementComponent,
    IoImpulseManagementComponent,
    DeviceManagementComponent,
    OperatingModeComponent,
    AideVisuelComponent
  ],
  imports: [
    CommonModule,
    ThemeModule,
    DataManagementRoutingModule,
    NbButtonModule,
    NbCardModule,
    NbIconModule,
    Ng2SmartTableModule,
    NbSpinnerModule,
    TranslateModule,
    FormsModule,
    NbSelectModule,
    NbInputModule,
    NbRadioModule
  ]
})
export class DataManagementModule { }
