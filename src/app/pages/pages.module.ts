import { NgModule } from '@angular/core';
import { NbIconModule, NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { RealtimeModule } from './realtime/realtime.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { FormsModule } from '@angular/forms';
import { HistoricalModule } from './historical/historical.module';
import { ReportModule } from './report/report.module';
import { SubAccountsModule } from './sub-accounts/sub-accounts.module';
import { DataManagementModule } from './data-management/data-management.module';
import { AlertModule } from './alert/alert.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    FormsModule,
    RealtimeModule,
    HistoricalModule,
    ReportModule,
    SubAccountsModule,
    DataManagementModule,
    AlertModule,
    MiscellaneousModule,
    NbIconModule,
  ],
  declarations: [
    PagesComponent,
  ],
  providers:[]
})
export class PagesModule {
}
