import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputDashComponent } from './input-dash.component';
import { InputDashRoutingModule } from './input-dash-routing.module';
import { FormsModule } from '@angular/forms';
import { ThemeModule } from '../../../@theme/theme.module';
import { NbActionsModule, NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../../../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    InputDashComponent
  ],
  imports: [
    CommonModule,
    InputDashRoutingModule,
    FormsModule,
    ThemeModule,
    NbCardModule,
    NbButtonModule,
    NbActionsModule,
    NbIconModule,
    HttpClientModule,
    SharedModule ,
    FontAwesomeModule  
  ]
})
export class InputDashModule { }
