import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbSidebarService } from '@nebular/theme';
import { delay, takeWhile } from 'rxjs/operators';
import { DataManagementService } from '../../../@core/service/data-management.service';
import { SubAccountService } from '../../../@core/service/sub-account.service';
import { LayoutService } from '../../../@core/utils';
import { owner } from '../../../global.config';

@Component({
  selector: 'ngx-dash-energy',
  templateUrl: './energy-dash.component.html',
  styleUrls: ['./energy-dash.component.scss']
})
export class EnergyDashComponent implements OnInit {

  owner: string = owner;
  private alive = true;
  myTimeout;
  menuExpanded : boolean = true;
  once: number = 0;

  constructor(public dataManagementService: DataManagementService,
     private _router: Router, private subAccountService: SubAccountService,
      public sidebarService: NbSidebarService, private layoutService: LayoutService) {
        try {
          this.dataManagementService.tenantData.zones[0].name;
            if(this.dataManagementService.liveReloadingRT == undefined){
              this.onGroupLoaded();
             }
        } catch (error) { }
        this.dataManagementService.GroupsLoaded$
           .pipe(takeWhile(() => this.alive))
           .pipe(delay(50))
           .subscribe(tenantData => {
             this.onGroupLoaded();
            });
        
      
       this.myTimeout = setTimeout(() => {
        if (document.getElementById("header-sidebar").classList.contains('expanded')) {
          this.sidebarService.toggle(true, 'menu-sidebar');
          this.layoutService.changeLayoutSize();
          this.once+=1;
        }
      });

      sidebarService.onToggle().pipe(
        takeWhile(()=>this.alive)
      ).subscribe(res => {
        if(this.once > 0) {
          this.menuExpanded = !this.menuExpanded;
        }
      });
      }
  
  

  ngOnInit() { }

  ngAfterViewInit() { }

  onGroupLoaded() {
    this.dataManagementService.startRt();
    this.dataManagementService.selectedZone =
    this.dataManagementService.selectedZone?
      this.dataManagementService.selectedZone: 
      this.dataManagementService.tenantData.zones[0];
  }

  ngOnDestroy(): void {
    clearTimeout(this.myTimeout);
    this.alive = false;
  }


}
