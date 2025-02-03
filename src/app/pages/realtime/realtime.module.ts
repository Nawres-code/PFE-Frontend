import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbTabsetModule,
  NbUserModule,
  NbRadioModule,
  NbSelectModule,
  NbListModule,
  NbIconModule,
  NbToggleModule,
  NbAccordionModule,
  NbInputModule,
  NbFormFieldModule
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HighchartsChartModule } from 'highcharts-angular';
import { RealtimeComponent } from './realtime.component';
import { RealtimeRoutingModule } from './realtime-routing.module';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { RealtimeFroidComponent } from './realtime-froid/realtime-froid.component';
import { InstallationPowerComponent } from './power/installation-power/installation-power.component';
import { MainpanelPowerComponent } from './power/mainpanel-power/mainpanel-power.component';
import { PowerActionComponent } from './power/power-action/power-action.component';
import { ZonePowerComponent } from './power/zone-power/zone-power.component';
import { PowerComponent } from './power/power.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { CdcDashComponent } from './cdc-dash/cdc-dash.component';

@NgModule({
  imports: [
    RealtimeRoutingModule,
    FormsModule,
    ThemeModule,
    NbCardModule,
    NbUserModule,
    NbButtonModule,
    NbTabsetModule,
    NbActionsModule,
    NbRadioModule,
    NbSelectModule,
    NbListModule,
    NbIconModule,
    NbButtonModule,
    HttpClientModule,
    HighchartsChartModule,
    NbToggleModule,
    NbAccordionModule,
    NbInputModule,
    NbFormFieldModule,
    FilterPipeModule,
    Ng2SmartTableModule,
    // InputDashModule
    FontAwesomeModule,
    TranslateModule
    ],
  declarations: [
    DashboardComponent,
    RealtimeComponent,
    RealtimeFroidComponent,
    InstallationPowerComponent,
    MainpanelPowerComponent,
    PowerActionComponent,
    ZonePowerComponent,
    PowerComponent,
    CdcDashComponent
  ],
})
export class RealtimeModule { }
