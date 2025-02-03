import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetosDashComponent } from './metos-dash/metos-dash.component';
import { NbAccordionModule, NbActionsModule, NbCardModule, NbIconModule, NbTabsetModule, NbTooltipModule, NbUserModule } from '@nebular/theme';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MetosDashRoutingModule } from './metos-dash-routing.module';
import { DatatableLeftComponent } from './datatable-left/datatable-left.component';
import { FormsModule } from '@angular/forms';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    MetosDashComponent,
    DatatableLeftComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    LeafletModule.forRoot(),
    MetosDashRoutingModule,
    FormsModule,
    NbTabsetModule,
    NbIconModule,
    NbActionsModule,
    NbUserModule,
    NbAccordionModule,
    FilterPipeModule,
    FontAwesomeModule,
    TranslateModule,
    NbTooltipModule
  ]
})
export class MetosDashModule { }
