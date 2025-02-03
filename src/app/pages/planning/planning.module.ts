import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanningRoutingModule } from './planning-routing.module';
import { PlanningComponent } from './planning/planning.component';
import { NbButtonModule, NbCardModule, NbInputModule, NbSelectModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PlanningComponent
  ],
  imports: [
    CommonModule,
    PlanningRoutingModule,
    NbCardModule,
    ThemeModule,
    NbInputModule,
    NbSelectModule,
    NbButtonModule,
    FormsModule
  ]
})
export class PlanningModule { }
