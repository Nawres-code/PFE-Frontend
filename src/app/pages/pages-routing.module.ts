import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { AdminGuard } from '../@core/utils/AdminGuard';
import { ReadOnlyGuard, ReadOnlyGuardController } from '../@core/utils';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    /*{
      path: 'iot-dashboard',
      component: DashboardComponent,
    }*/
    {
      path: 'realtime',
      loadChildren: () => import('./realtime/realtime.module')
        .then(m => m.RealtimeModule),
    },
    {
      path: 'historical',
      loadChildren: () => import('./historical/historical.module')
        .then(m => m.HistoricalModule)
    },
    {
      path: 'planning',
      loadChildren: () => import('./planning/planning.module')
        .then(m => m.PlanningModule),
    },
    {
      path: 'data-management',
      loadChildren: () => import('./data-management/data-management.module')
        .then(m => m.DataManagementModule),
      canActivate: [ReadOnlyGuard],
    },

    {
      path: 'report',
      loadChildren: () => import('./report/report.module')
        .then(m => m.ReportModule),
    },
    {
      path: 'alerts',
      loadChildren: () => import('./alert/alert.module')
        .then(m => m.AlertModule),
    },
    {
      path: 'sub-accounts',
      loadChildren: () => import('./sub-accounts/sub-accounts.module')
        .then(m => m.SubAccountsModule),
      canActivate: [AdminGuard]
    },
    {
      path: '',
      redirectTo: 'realtime',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
