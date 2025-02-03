import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRtComponent } from './dashboard-rt/dashboard-rt.component';
import { GpsGraphComponent } from './gps-graph/gps-graph.component';
import { InputsBarComponent } from './inputs-bar/inputs-bar.component';
import { SlideOutComponent } from './slide-out/slide-out.component';
import { ThemeModule } from '../@theme/theme.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { DeveloppementComponent } from './developpement/developpement.component';
import { NbButtonModule, NbCardModule } from '@nebular/theme';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    HighchartsChartModule,
    NbCardModule,
    NbButtonModule,
    FontAwesomeModule
  ],
  declarations: [
    DashboardRtComponent,
    GpsGraphComponent,
    InputsBarComponent,
    SlideOutComponent, DeveloppementComponent
  ],
  exports:[
    DashboardRtComponent,
    GpsGraphComponent,
    InputsBarComponent,
    SlideOutComponent,
    DeveloppementComponent
  ]
})
export class SharedModule { }
