import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NbSidebarService } from '@nebular/theme';
import { take, takeWhile } from 'rxjs/operators';
import { DataManagementService } from '../../@core/service/data-management.service';
import { SubAccountService } from '../../@core/service/sub-account.service';
import { owner } from '../../global.config';

@Component({
  selector: 'ngx-realtime',
  templateUrl: './realtime.component.html',
  styleUrls: ['./realtime.component.scss']
})
export class RealtimeComponent {

  owner: string = owner;
  private alive = true;
  menuExpanded: boolean = false;

  constructor(public dataManagementService: DataManagementService,
    private _router: Router, private subAccountService: SubAccountService, public sidebarService: NbSidebarService) {
      // if(this.dataManagementService.liveReloadingRT == undefined) {
      //   this.onGroupLoaded();
      //  } .subscribe(tenantData => this.onGroupLoaded());


    sidebarService.getSidebarState('menu-sidebar')
      .pipe(take(1))
      .subscribe(
        resp => {
          this.menuExpanded = resp == 'expanded';
        });

    sidebarService.onToggle()
      .pipe(takeWhile(() => this.alive))
      .subscribe(resp => {
        sidebarService.getSidebarState('menu-sidebar')
          .pipe(take(1))
          .subscribe( resp => {
              this.menuExpanded = resp == 'expanded';
          });
      });
       
      try {
        this.dataManagementService.tenantData.zones[0].name;
        if(this.dataManagementService.liveReloadingRT == undefined) {
          this.onGroupLoaded();
        }
      } catch (error) {
        this.dataManagementService.GroupsLoaded$
        .pipe(takeWhile(() => this.alive))
        .subscribe(
          resp =>{ this.onGroupLoaded();}
        );
     }
  }

  onGroupLoaded() {
    this.dataManagementService.startRt();
    this.dataManagementService.selectedZone =
      this.dataManagementService.selectedZone ?
        this.dataManagementService.selectedZone :
        this.dataManagementService.tenantData.zones[0];
  }

  ngOnDestroy(): void {
    this.dataManagementService.stopRt();
    this.alive = false;
  }

}
