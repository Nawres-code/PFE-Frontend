import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TempDashComponent } from './temp-dash.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../../@theme/theme.module';
import { NbAccordionModule, NbActionsModule, NbButtonModule, NbCardModule, NbDatepickerModule, NbFormFieldModule, NbIconModule, NbInputModule, NbSelectModule, NbTimepickerModule, NbToggleModule } from '@nebular/theme';
import { HttpClientModule } from '@angular/common/http';
import { HighchartsChartModule } from 'highcharts-angular';
import { TempDashRoutingModule } from './temp-dash-routing.module';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { InstallationCardComponent } from './installation-card/installation-card.component';
import { SharedModule } from '../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    TempDashComponent,
    InstallationCardComponent,
  ],
  imports: [
    CommonModule,
    TempDashRoutingModule,
    FormsModule,
    NbFormFieldModule,
    ThemeModule,
    NbCardModule,
    NbButtonModule,
    NbActionsModule,
    NbIconModule,
    HttpClientModule,
    HighchartsChartModule,
    NbToggleModule,
    FilterPipeModule,
    NbInputModule,
    NbAccordionModule,
    NbInputModule,
    NbDatepickerModule,
    NbTimepickerModule,
    ReactiveFormsModule,
    NbSelectModule,
    SharedModule,
    TranslateModule
  ]
})
export class TempDashModule { }
