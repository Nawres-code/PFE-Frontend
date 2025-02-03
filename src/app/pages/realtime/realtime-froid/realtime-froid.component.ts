import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { delay, takeWhile } from 'rxjs/operators';
import { TenantData } from '../../../@core/data/data';
import { DataManagementService } from '../../../@core/service/data-management.service';
import { LayoutService } from '../../../@core/utils';

@Component({
  selector: 'ngx-realtime-froid',
  templateUrl: './realtime-froid.component.html',
  styleUrls: ['./realtime-froid.component.scss']
})
export class RealtimeFroidComponent implements OnInit, OnDestroy {
  private alive: boolean = true;
  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      zone: {
        title: 'Zone',
        type: 'string'
      },
      installation: {
        title: 'Installation',
        type: 'string'
      },
      deviceFroid: {
        title: 'Device Froid',
        type: 'string'
      }
    }
  };

  dataFroid: any[] = [];

  source: LocalDataSource = new LocalDataSource();

  constructor(public dataManagementService: DataManagementService, private sidebarService:NbSidebarService, private layoutService:LayoutService) { 

    if (document.getElementById("header-sidebar").classList.contains('expanded')) {
      this.sidebarService.toggle(true, 'menu-sidebar');
      this.layoutService.changeLayoutSize();
    }
    
    this.dataManagementService.GroupsLoaded$
    .pipe(takeWhile(()=> this.alive))
    .subscribe(tenantData => this.onGroupLoaded(tenantData));

  }

  refresh() {
    this.settings.columns={
      zone: {
        title: 'Zone',
        type: 'string'
      },
      installation: {
        title: 'Installation',
        type: 'string'
      },
      deviceFroid: {
        title: 'Device Froid',
        type: 'string'
      }
    };
    let count = 0;
    for (let i = 0; i < this.dataManagementService.tenantData.zones.length; i++) {
      for (let j = 0; j < this.dataManagementService.tenantData.zones[i].installations.length; j++) {
        for (let k = 0; k < this.dataManagementService.tenantData.zones[i].installations[j].deviceFroids.length; k++) {
          this.dataFroid[count] = new Object();
          this.dataFroid[count].zone = this.dataManagementService.tenantData.zones[i].name;
          this.dataFroid[count].installation = this.dataManagementService.tenantData.zones[i].installations[j].name;
          this.dataFroid[count].deviceFroid = this.dataManagementService.tenantData.zones[i].installations[j].deviceFroids[k].label;
          for (let l = 0; l < this.dataManagementService.tenantData.zones[i].installations[j].deviceFroids[k].points.length; l++) {
            if (!this.settings.columns[this.dataManagementService.tenantData.zones[i].installations[j].deviceFroids[k].points[l].label]) {
              this.settings.columns[this.dataManagementService.tenantData.zones[i].installations[j].deviceFroids[k].points[l].label] = {
                title: this.dataManagementService.tenantData.zones[i].installations[j].deviceFroids[k].points[l].label,
                type: 'html',
                valuePrepareFunction: (cell) => {return '<html><p class="back_danger">' + cell + '</p><html>';}
              };
            }
            this.dataFroid[count][this.dataManagementService.tenantData.zones[i].installations[j].deviceFroids[k].points[l].label] =
              this.dataManagementService.dataRtDto.zonesRtDto[this.dataManagementService.tenantData.zones[i].idZone].installationsRtDto[this.dataManagementService.tenantData.zones[i].installations[j].id].pointRtDto[this.dataManagementService.tenantData.zones[i].installations[j].deviceFroids[k].points[l].id + this.dataManagementService.tenantData.zones[i].installations[j].deviceFroids[k].points[l].deviceId * 1000].value
              + " " + this.dataManagementService.tenantData.zones[i].installations[j].deviceFroids[k].points[l].unit;
          }

          count++;
        }
      }

    }
    this.settings = Object.assign({}, this.settings );
    this.source.load(this.dataFroid);
  }

  ngOnInit() {
    try {
      this.refresh();
    } catch (error) {
      this.dataManagementService.init();
    }
  }
  
  onGroupLoaded(tenantData: TenantData) {
    this.dataManagementService.DataLoaded$
    .pipe(takeWhile(()=> this.alive))
    .pipe(delay(50))
    .subscribe(() => this.refresh());
  }
  
  ngOnDestroy() {
    this.alive = false;
  }
}
