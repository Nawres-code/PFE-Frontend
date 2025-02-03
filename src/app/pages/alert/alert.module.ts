import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertRoutingModule } from './alert-routing.module';
import { ThemeModule } from '../../@theme/theme.module';
import { AlertComponent } from './alert.component';
import { NbButtonModule, NbCardModule, NbCheckboxModule, NbDatepickerModule, NbFormFieldModule, NbIconModule, NbInputModule, NbListModule, NbPopoverModule, NbRadioModule, NbSelectModule, NbSpinnerComponent, NbSpinnerModule, NbTimepickerModule, NbToggleModule, NbTooltipModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertDetailsComponent, NgxPopoverTabsComponent } from './alert-details/alert-details.component';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { AlertFormComponent } from './alert-form/alert-form.component';
import { CronSettingsComponent } from './cron-settings/cron-settings.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AlertHistoryComponent } from './alert-history/alert-history.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AlertComponent,
    AlertDetailsComponent,
    AlertDialogComponent,
    AlertFormComponent,
    CronSettingsComponent, 
    NgxPopoverTabsComponent, AlertHistoryComponent
  ],
  imports: [
    CommonModule,
    ThemeModule,
    AlertRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NbCardModule,
    NbSelectModule,
    NbButtonModule,
    NbDatepickerModule,
    NbTimepickerModule,
    NbEvaIconsModule,
    NbIconModule,
    NbInputModule,
    NbSpinnerModule,
    NbCheckboxModule,
    NbToggleModule,
    NbListModule,
    NbTooltipModule,
    NbPopoverModule,
    NbFormFieldModule, 
    NbRadioModule,
    Ng2SmartTableModule,
    FontAwesomeModule,
    TranslateModule
  ], 
  entryComponents: [NgxPopoverTabsComponent]
})
export class AlertModule { } 
