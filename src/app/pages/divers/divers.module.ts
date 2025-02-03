import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { DiversComponent } from './divers/divers.component';
import { DiversRoutingModule } from './divers-routing.module';
import { NbButton, NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    DiversComponent
  ],
  imports: [
    ThemeModule,
    DiversRoutingModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    TranslateModule
  ]
})
export class DiversModule { }
