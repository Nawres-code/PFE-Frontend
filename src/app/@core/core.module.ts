import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { of as observableOf } from 'rxjs';

import { throwIfAlreadyLoaded } from './module-import-guard';
import {
  AnalyticsService,
  AuthGuard,
  LayoutService,
  PlayerService,
  ReadOnlyGuard,
  SeoService,
  StateService,
} from './utils';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { CheckboxComponent, CheckboxEditComponent } from './utils/smartTable/checkbox/checkbox.component';
import { SelectedComponent, SelectedEditComponent } from './utils/smartTable/selected/selected.component';
import { FormsModule } from '@angular/forms';
import { SmartTableData } from './utils/smart-table';
import { SigninService } from './service/signin.service';
import { SubAccountService } from './service/sub-account.service';
import { DetailsService } from './service/details.service';
import { GraphService } from './service/graph.service';
import { DataManagementService } from './service/data-management.service';
import { EnergyService } from './service/energy.service';
import { ArchivemetosService } from './service/archivemetos.service';
import { ConfigurationDropListCellService, ConfigurationDropListComponent, ConfigurationDropListEditComponent, DropListCellService, DropListComponent, DropListEditComponent } from './utils/smartTable/drop-list/drop-list.component';
import { NbSelectModule } from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { Utils } from './utils/global/utils';
import { ReportService } from './service/report.service';
import { AdminGuard } from './utils/AdminGuard';
import { AlarmPointsFilterPipe } from './pipes/alarm-points-filter.pipe';
import { HighchartsChartModule } from 'highcharts-angular';
import { authInterceptorProviders } from './utils/auth.interceptor';
// import ngx-translate and the http loader
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { SolarService } from './service/solar.service';
import { SolarData } from './data/solar';
import { ReadOnlyGuardController } from './utils/readOnlyGuardController';
import { TrafficBarData } from './data/traffic-bar';
import { TrafficBarService } from './service/traffic-bar.service';
import { TrafficListData } from './data/traffic-list';
import { TrafficListService } from './service/traffic-list.service';
import { PeriodsService } from './service/periods.service';


export class NbSimpleRoleProvider extends NbRoleProvider {
  getRole() {
    // here you could provide any role based on any auth flow
    return observableOf('guest');
  }
}


const DATA_SERVICES = [
  { provide: SolarData, useClass: SolarService },
  { provide: TrafficBarData, useClass: TrafficBarService },
  { provide: TrafficListData, useClass: TrafficListService },
]

export const NB_CORE_PROVIDERS = [
  //...MockDataModule.forRoot().providers,
  ...DATA_SERVICES,

  NbSecurityModule.forRoot({
    accessControl: {
      guest: {
        view: '*',
      },
      user: {
        parent: 'guest',
        create: '*',
        edit: '*',
        remove: '*',
      },
    },
  }).providers,

  {
    provide: NbRoleProvider, useClass: NbSimpleRoleProvider,
  },
  AnalyticsService,
  LayoutService,
  PlayerService,
  SeoService,
  StateService,
  AuthGuard,
  { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
  JwtHelperService,
  { provide: SmartTableData },
  SigninService,
  SubAccountService,
  DetailsService,
  GraphService,
  DataManagementService,
  EnergyService,
  ArchivemetosService,
  DropListCellService,
  ConfigurationDropListCellService,
  Utils,
  ReportService,
  AdminGuard,
  authInterceptorProviders,
  TranslateModule,
  ReadOnlyGuard,
  ReadOnlyGuardController,
  PeriodsService
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ThemeModule,
    NbSelectModule,
    HighchartsChartModule,
    // ngx-translate and the loader module
    HttpClientModule,
    TranslateModule,
  ],
  exports: [

  ],
  declarations: [
    CheckboxComponent, CheckboxEditComponent, SelectedComponent,
    SelectedEditComponent, DropListComponent, DropListEditComponent,
    ConfigurationDropListComponent, ConfigurationDropListEditComponent,
    AlarmPointsFilterPipe,
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}

