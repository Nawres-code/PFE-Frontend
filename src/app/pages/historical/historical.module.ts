import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { HistoricalRoutingModule } from './historical-routing.module';
import { HistoricalComponent } from './historical.component';
import { DetailsComponent } from './details/details.component';
import { EnergyComponent } from './energy/energy.component';
import { DetailsGraphComponent } from './details/details-graph/details-graph.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbAccordionModule, NbButtonModule, NbCardModule, NbDatepickerModule, NbIconModule, NbInputModule, NbSelectModule, NbSpinnerModule, NbTagModule, NbTimepickerModule } from '@nebular/theme';
import { ComparatorGraphComponent } from './comparator/comparator-graph/comparator-graph.component';
import { ComparatorSidepanelComponent } from './comparator/comparator-sidepanel/comparator-sidepanel.component';
import { FormComparatorComponent } from './comparator/form-comparator/form-comparator.component';
import { ComparatorComponent } from './comparator/comparator.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { EnergyGraphComponent } from './energy/energy-graph/energy-graph.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { SensorComponent } from './sensor/sensor.component';

@NgModule({
  declarations: [
    HistoricalComponent,
    DetailsComponent,
    EnergyComponent,
    DetailsGraphComponent,
    EnergyGraphComponent,
    ComparatorComponent,
    ComparatorGraphComponent,
    ComparatorSidepanelComponent,
    FormComparatorComponent,
    SensorComponent,
  ],
  imports: [
    CommonModule,
    ThemeModule,
    HistoricalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NbCardModule,
    NbSelectModule,
    NbButtonModule,
    NbIconModule,
    NbInputModule,
    NbDatepickerModule,
    NbTimepickerModule,
    NbAccordionModule,
    NbSpinnerModule,
    HighchartsChartModule,
    FontAwesomeModule,
    TranslateModule

  ],
  entryComponents: [FormComparatorComponent]

})


export class HistoricalModule { 

}

