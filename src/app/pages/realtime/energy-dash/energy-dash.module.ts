import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnergyDashComponent } from './energy-dash.component';
import { EnergyRoutingModule } from './energy-dash-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NbCardModule, NbUserModule, NbButtonModule, NbTabsetModule, NbActionsModule, NbRadioModule, NbSelectModule, NbListModule, NbIconModule, NbToggleModule, NbAccordionModule, NbInputModule, NbFormFieldModule, NbSpinnerModule } from '@nebular/theme';
import { HighchartsChartModule } from 'highcharts-angular';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { ThemeModule } from '../../../@theme/theme.module';
import { InstallationComponent } from './installation/installation.component';
import { InstallationCardComponent } from '../temp-dash/installation-card/installation-card.component';
import { SidepanelComponent } from './sidepanel/sidepanel.component';
import { ZoneComponent } from './zone/zone.component';
import { BarChartComponent } from './zone/bar-chart/bar-chart.component';
import { ColumnChartComponent } from './zone/column-chart/column-chart.component';
import { ColumnCompareComponent } from './zone/column-compare/column-compare.component';
import { PercentageComponent } from './zone/percentage/percentage.component';
import { PopupDescComponent } from './zone/popup-desc/popup-desc.component';
import { ZoneListComponent } from './zone-list/zone-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IoListComponent } from './zone/io-list/io-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { StackedBarImpulseComponent } from './zone/stackedBar/stackedBarImpulse/stacked-bar-impulse.component';
import { StackedBarEnergyComponent } from './zone/stackedBar/stackedBarEnergy/stacked-bar-energy.component';



@NgModule({
  declarations: [
    EnergyDashComponent,
    InstallationComponent,
    InstallationCardComponent,
    SidepanelComponent,
    ZoneComponent,
    BarChartComponent,
    ColumnChartComponent,
    ColumnCompareComponent,
    PercentageComponent,
    PopupDescComponent,
    ZoneListComponent,
    DashboardComponent,
    IoListComponent,
    StackedBarImpulseComponent,
    StackedBarEnergyComponent
  ],
  imports: [
    CommonModule,
    EnergyRoutingModule,
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
    NbSpinnerModule,
    FontAwesomeModule,
    TranslateModule
  ]
})
export class EnergyDashModule { }
