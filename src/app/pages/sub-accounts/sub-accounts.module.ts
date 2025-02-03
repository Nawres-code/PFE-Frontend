import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubAccountsRoutingModule } from './sub-accounts-routing.module';
import { SubAccountsComponent } from './sub-accounts/sub-accounts.component';
import { ThemeModule } from '../../@theme/theme.module';
import { NbButtonModule, NbCardModule, NbIconModule, NbSelectModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    SubAccountsComponent
  ],
  imports: [
    CommonModule,
    ThemeModule,
    SubAccountsRoutingModule,
    NbButtonModule,
    NbCardModule,
    NbIconModule,
    Ng2SmartTableModule,
    NbSelectModule,
    FontAwesomeModule,
    TranslateModule
  ]
})
export class SubAccountsModule { }
