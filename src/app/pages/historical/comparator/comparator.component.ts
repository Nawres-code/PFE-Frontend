import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { DataManagementService } from '../../../@core/service/data-management.service';
import { GraphService } from '../../../@core/service/graph.service';
import { LayoutService } from '../../../@core/utils';

@Component({
  selector: 'ngx-comparator',
  templateUrl: './comparator.component.html',
  styleUrls: ['./comparator.component.scss']
})
export class ComparatorComponent implements OnInit, OnDestroy {

  constructor(public graphService: GraphService, public dataManagementService: DataManagementService, private sidebarService:NbSidebarService, private layoutService:LayoutService) { 

    if (document.getElementById("header-sidebar").classList.contains('expanded')) {
      this.sidebarService.toggle(true, 'menu-sidebar');
      this.layoutService.changeLayoutSize();
    }
      try {
      this.dataManagementService.tenantData.zones[0].name;
      this.onGroupLoaded();
    } catch (error) { }
  }

  ngOnDestroy(): void {
    this.graphService.reset();
  }

  ngOnInit() {
  }


  onGroupLoaded() {
    this.dataManagementService.selectedZone =
      this.dataManagementService.selectedZone ?
        this.dataManagementService.selectedZone : this.dataManagementService.tenantData.zones[0];
  }

}
