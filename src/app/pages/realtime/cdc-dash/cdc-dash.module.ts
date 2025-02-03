import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdcDashRoutingModule } from './cdc-dash-routing.module';
import { ZoneCdcComponent } from './zone-cdc/zone-cdc.component';
import { NbCardModule, NbIconModule, NbListModule, NbSelectModule } from '@nebular/theme';
import { MatTabsModule } from '@angular/material/tabs';import { ChartModule } from 'angular2-chartjs';
import { ThemeModule } from '../../../@theme/theme.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { ProductionComponent } from './production/production.component';
import { BreakTimeComponent } from './break-time/break-time.component';
import { PieChartComponent } from './break-time/pie-chart/pie-chart.component';
import { BarChartComponent } from './break-time/bar-chart/bar-chart.component';
import { TrafficRevealCardComponent } from './break-time/traffic-reveal-card/traffic-reveal-card.component';
import { TrafficCardsHeaderComponent } from './break-time/traffic-reveal-card/traffic-cards-header/traffic-cards-header.component';
import { TrafficCardsFrontComponent } from './break-time/traffic-reveal-card/traffic-cards-front/traffic-cards-front.component';
import { TrafficBarComponent } from './break-time/traffic-reveal-card/traffic-cards-front/traffic-bar/traffic-bar.component';

@NgModule({
  declarations: [
    ZoneCdcComponent,
    TrafficRevealCardComponent,
    TrafficCardsHeaderComponent,
    TrafficCardsFrontComponent,
    TrafficBarComponent,
    ProductionComponent,
    BreakTimeComponent,
    PieChartComponent,
    BarChartComponent
  ],
  imports: [
    ThemeModule,
    CommonModule,
    FormsModule,
    CdcDashRoutingModule,
    NbIconModule,
    MatTabsModule,
    NbCardModule,
    NbSelectModule,
    NbIconModule,
    NbListModule,
    ChartModule,
    NgxEchartsModule,
    NgxChartsModule,
  ]
})
export class CdcDashModule { }
