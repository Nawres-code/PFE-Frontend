import { Component, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { Installation } from '../../../@core/data/data';
import { DataManagementService } from '../../../@core/service/data-management.service';
import { GraphService } from '../../../@core/service/graph.service';
import { LayoutService } from '../../../@core/utils';
import { orderByField } from '../../../@core/utils/global/order';
import { owner } from '../../../global.config';

@Component({
  selector: 'ngx-temp-dash',
  templateUrl: './temp-dash.component.html',
  styleUrls: ['./temp-dash.component.scss']
})
export class TempDashComponent implements OnDestroy, OnInit {
  alive: boolean = true;
  search: any = { name: '' };
  myTimeout;
  owner = owner;
  constructor(public dataManagementService: DataManagementService, public graphService: GraphService,
    public sidebarService: NbSidebarService, private layoutService: LayoutService) 
  {     this.myTimeout = setTimeout(() => {
    try {
      if (document.getElementById("header-sidebar").classList.contains('expanded')) {
        this.sidebarService.toggle(true, 'menu-sidebar');
        this.layoutService.changeLayoutSize();
      }
    } catch (error) { }
  });

  if(this.dataManagementService.liveReloadingRT == undefined){
    this.onGroupLoaded();
   }
   if(this.owner == 'MEKATECHNOAUTH') {
    this.graphService.showGraph = true;
    localStorage.setItem("graph", "true"); 
   }
}

  ngOnInit(): void {
    if (localStorage.getItem("graph") == "true") {
      this.graphService.showGraph = true
    } else {
      this.graphService.showGraph = false
    }
    this.dataManagementService.getInptCacheStatus();
 
   }

  @ViewChildren('item') accordions;
  toggle() {
    this.accordions.forEach(element => element.close());
    this.graphService.showGraph = false;
  }

  ngOnDestroy() {
    this.alive = false;
    clearTimeout(this.myTimeout);
  }

  onGroupLoaded() {
    this.dataManagementService.startRt();
    this.dataManagementService.selectedZone =
    this.dataManagementService.selectedZone?
      this.dataManagementService.selectedZone: 
      this.dataManagementService.tenantData.zones[0];
  }

  orderInstalltionByName(installations: Installation[]){
    return orderByField(installations, 'name');
  }
}